"""
SEO Audit (client-ready) using BROWSER DOM extraction (Playwright).

Goal:
- Read pages like modern Google (renders JavaScript)
- Extract JSON-LD and links from the REAL DOM (not only page.content())
- Crawl internal pages (limited)
- Generate seo-report.md for clients (NO code snippets in the report)

Install:
  pip install playwright beautifulsoup4 lxml
  playwright install

Run:
  python seo_audit.py <website-url>
  python seo_audit.py <website-url> --max-pages 20
  python seo_audit.py <website-url> --out <output-file>

Notes:
- If your site shows a cookie banner overlay, you can set --cookie-accept-text "Accept"
"""

from __future__ import annotations

import argparse
import asyncio
import json
import re
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set, Tuple
from urllib.parse import urljoin, urlparse, urldefrag

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright


# ----------------------------
# Heuristics (client-friendly)
# ----------------------------

TITLE_MIN, TITLE_MAX = 15, 65
DESC_MIN, DESC_MAX = 70, 160
MIN_WORDS_OK = 250

JSONLD_TYPE_RE = re.compile(r'"@type"\s*:\s*("([^"]+)"|\[([^\]]+)\])', re.I)

USER_AGENT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"


# ----------------------------
# Utilities
# ----------------------------

def norm_url(u: str) -> str:
    u = u.strip()
    u, _ = urldefrag(u)
    return u

def host(url: str) -> str:
    return urlparse(url).netloc.lower()

def same_host(a: str, b: str) -> bool:
    return host(a) == host(b)

def md_escape(s: str) -> str:
    return (s or "").replace("\n", " ").strip()

def now_str() -> str:
    return time.strftime("%Y-%m-%d %H:%M:%S")

def clamp(n: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, n))

def grade(score: int) -> Tuple[str, str]:
    if score >= 90:
        return "A", "Excelente"
    if score >= 80:
        return "B", "Muito bom"
    if score >= 70:
        return "C", "Bom"
    if score >= 55:
        return "D", "Atenção"
    return "E", "Crítico"

def ok_icon(ok: bool) -> str:
    return "✅" if ok else "❌"

def warn_icon() -> str:
    return "⚠️"


# ----------------------------
# Models
# ----------------------------

@dataclass
class PageAudit:
    url: str
    final_url: str = ""
    status: Optional[int] = None
    load_time_sec: float = 0.0

    title: str = ""
    meta_description: str = ""
    meta_robots: str = ""
    canonical: str = ""
    lang: str = ""
    viewport: bool = False

    og: Dict[str, str] = field(default_factory=dict)
    twitter: Dict[str, str] = field(default_factory=dict)

    h1: List[str] = field(default_factory=list)
    h2: List[str] = field(default_factory=list)
    h3: List[str] = field(default_factory=list)

    word_count: int = 0

    # Links
    internal_links: int = 0
    external_links: int = 0
    anchor_links: int = 0
    nofollow_links: int = 0

    images: int = 0
    images_missing_alt: int = 0

    schema_types: List[str] = field(default_factory=list)

    issues: List[str] = field(default_factory=list)
    wins: List[str] = field(default_factory=list)


@dataclass
class SiteAudit:
    start_url: str
    host: str
    pages: List[PageAudit] = field(default_factory=list)

    robots_url: str = ""
    sitemap_url: str = ""
    llms_url: str = ""

    robots_ok: Optional[bool] = None
    sitemap_ok: Optional[bool] = None
    llms_ok: Optional[bool] = None


# ----------------------------
# Extraction helpers (Soup)
# ----------------------------

def extract_visible_text(soup: BeautifulSoup) -> str:
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    txt = soup.get_text(" ", strip=True)
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt

def extract_schema_types_from_jsonld_blocks(jsonld_blocks: List[str]) -> List[str]:
    """
    Parse JSON-LD blocks (strings) to collect @type values.
    Robust to minor formatting issues (regex fallback).
    """
    types: Set[str] = set()

    def walk(obj):
        if isinstance(obj, dict):
            t = obj.get("@type")
            if isinstance(t, str):
                types.add(t)
            elif isinstance(t, list):
                for x in t:
                    if isinstance(x, str):
                        types.add(x)
            for v in obj.values():
                walk(v)
        elif isinstance(obj, list):
            for it in obj:
                walk(it)

    for raw in jsonld_blocks:
        raw = (raw or "").strip()
        if not raw:
            continue

        # strict json
        try:
            data = json.loads(raw)
            walk(data)
            continue
        except Exception:
            pass

        # fallback regex
        for m in JSONLD_TYPE_RE.finditer(raw):
            if m.group(2):
                types.add(m.group(2))
            elif m.group(3):
                for t2 in re.findall(r'"([^"]+)"', m.group(3)):
                    types.add(t2)

    return sorted(types)


# ----------------------------
# Playwright DOM extraction
# ----------------------------

async def maybe_accept_cookies(page, text: str, timeout_ms: int) -> None:
    """
    Attempt to click a button with provided text (e.g., "Accept").
    Safe best-effort. Does nothing if not found.
    """
    if not text:
        return
    try:
        btn = page.get_by_role("button", name=re.compile(re.escape(text), re.I))
        await btn.first.click(timeout=timeout_ms)
        await page.wait_for_timeout(300)
    except Exception:
        try:
            loc = page.locator(f"text={text}")
            await loc.first.click(timeout=timeout_ms)
            await page.wait_for_timeout(300)
        except Exception:
            return

async def check_endpoint_ok(page, url: str, timeout_ms: int) -> bool:
    try:
        r = await page.request.get(url, timeout=timeout_ms)
        return r.ok
    except Exception:
        return False

async def fetch_page_dom(page, url: str, timeout_ms: int, cookie_accept_text: str) -> Tuple[int, str, float, str, List[str], List[str], List[Tuple[str, List[str]]]]:
    """
    Load page and return:
      status, final_url, load_time_sec, html_content,
      jsonld_blocks (from DOM), hrefs (from DOM),
      link_rel_data: list of (href, rel_tokens_lower)
    """
    t0 = time.perf_counter()
    resp = await page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
    status = resp.status if resp else 0

    await maybe_accept_cookies(page, cookie_accept_text, timeout_ms=1500)

    # Wait for core elements to settle (stable for Next)
    try:
        await page.wait_for_selector("h1", timeout=2500)
    except Exception:
        pass
    try:
        await page.wait_for_selector('script[type="application/ld+json"]', timeout=2500)
    except Exception:
        pass
    try:
        await page.wait_for_selector("a[href]", timeout=2500)
    except Exception:
        pass

    await page.wait_for_timeout(250)

    final_url = page.url
    html = await page.content()
    load_time = time.perf_counter() - t0

    # JSON-LD (you said it's working for you already, keeping as-is)
    jsonld_blocks = await page.locator('script[type="application/ld+json"]').all_inner_texts()

    # hrefs from DOM
    hrefs = await page.locator("a[href]").evaluate_all(
        """(els) => els.map(a => a.getAttribute('href')).filter(Boolean)"""
    )
    hrefs = [str(h).strip() for h in hrefs if str(h).strip()]

    # rel tokens
    link_rel_data = await page.locator("a[href]").evaluate_all(
        """(els) => els.map(a => [a.getAttribute('href') || '', (a.getAttribute('rel') || '').split(/\\s+/).filter(Boolean)])"""
    )
    link_rel_data_norm: List[Tuple[str, List[str]]] = []
    for href, rels in link_rel_data:
        rels_norm = [str(x).lower() for x in (rels or [])]
        link_rel_data_norm.append((str(href).strip(), rels_norm))

    return status, final_url, load_time, html, jsonld_blocks, hrefs, link_rel_data_norm


# ----------------------------
# Audit from DOM + HTML
# ----------------------------

def is_anchor_link(href: str) -> bool:
    """
    Anchors that point to same page sections:
      - "#section"
      - "/#section"
      - "https://site.com/#section" (same host handled later)
    """
    if not href:
        return False
    href = href.strip()
    if href.startswith("#"):
        return True
    if href.startswith("/#"):
        return True
    return False


def audit_from_dom(url: str, final_url: str, status: int, load_time_sec: float, html: str,
                   jsonld_blocks: List[str], hrefs: List[str], link_rel_data: List[Tuple[str, List[str]]]) -> PageAudit:
    soup = BeautifulSoup(html, "lxml")
    p = PageAudit(url=url, final_url=final_url, status=status, load_time_sec=load_time_sec)

    # html lang
    html_tag = soup.find("html")
    if html_tag and html_tag.get("lang"):
        p.lang = (html_tag.get("lang") or "").strip()

    # viewport
    p.viewport = soup.find("meta", attrs={"name": "viewport"}) is not None

    # title
    t = soup.find("title")
    if t:
        p.title = (t.get_text(strip=True) or "").strip()

    # meta description
    md = soup.find("meta", attrs={"name": "description"})
    if md and md.get("content"):
        p.meta_description = (md.get("content") or "").strip()

    # meta robots
    mr = soup.find("meta", attrs={"name": re.compile(r"robots", re.I)})
    if mr and mr.get("content"):
        p.meta_robots = (mr.get("content") or "").strip()

    # canonical
    canon = soup.find("link", attrs={"rel": re.compile(r"canonical", re.I)})
    if canon and canon.get("href"):
        p.canonical = urljoin(final_url, canon.get("href").strip())

    # OG/Twitter
    for meta in soup.find_all("meta"):
        prop = meta.get("property") or meta.get("name")
        content = meta.get("content")
        if not prop or not content:
            continue
        prop = prop.strip()
        content = content.strip()
        if prop.startswith("og:"):
            p.og[prop] = content
        if prop.startswith("twitter:"):
            p.twitter[prop] = content

    # headings
    p.h1 = [h.get_text(" ", strip=True) for h in soup.find_all("h1")]
    p.h2 = [h.get_text(" ", strip=True) for h in soup.find_all("h2")]
    p.h3 = [h.get_text(" ", strip=True) for h in soup.find_all("h3")]

    # content words
    text = extract_visible_text(soup)
    p.word_count = len(text.split()) if text else 0

    # images alt
    imgs = soup.find_all("img")
    p.images = len(imgs)
    missing_alt = 0
    for img in imgs:
        alt = img.get("alt")
        if alt is None or not alt.strip():
            missing_alt += 1
    p.images_missing_alt = missing_alt

    # Schema
    p.schema_types = extract_schema_types_from_jsonld_blocks(jsonld_blocks)

    # Links (now includes anchors)
    internal = external = nofollow = anchors = 0
    for href in hrefs:
        href = (href or "").strip()
        if not href:
            continue
        if href.startswith(("mailto:", "tel:", "javascript:")):
            continue

        # Anchor links: count separately, and also count as internal
        if is_anchor_link(href):
            anchors += 1
            internal += 1
            continue

        # Normal links
        absu = norm_url(urljoin(final_url, href))
        if absu.startswith("http") and same_host(final_url, absu):
            internal += 1
        else:
            # If it's relative but not starting with http, it's internal too
            if not absu.startswith("http"):
                internal += 1
            else:
                external += 1

    for href, rels in link_rel_data:
        if not href:
            continue
        href = href.strip()
        if href.startswith(("mailto:", "tel:", "javascript:")):
            continue
        if "nofollow" in (rels or []):
            nofollow += 1

    p.internal_links = internal
    p.external_links = external
    p.anchor_links = anchors
    p.nofollow_links = nofollow

    # Wins/issues
    if p.title:
        p.wins.append("✅ Título da página definido (importante para o Google e para o clique).")
    else:
        p.issues.append("❌ Falta título da página (o Google pode exibir um título ruim nos resultados).")

    if p.meta_description:
        p.wins.append("✅ Descrição (meta description) presente (ajuda no clique/CTR).")
    else:
        p.issues.append("❌ Falta descrição (meta description).")

    if p.canonical:
        p.wins.append("✅ URL canônica configurada (evita duplicidade).")
    else:
        p.issues.append("⚠️ Falta URL canônica (pode gerar páginas duplicadas).")

    if len(p.h1) == 1:
        p.wins.append("✅ Estrutura com 1 H1 (bom para hierarquia e entendimento).")
    elif len(p.h1) == 0:
        p.issues.append("❌ Página sem H1 (dificulta entendimento do tema principal).")
    else:
        p.issues.append("⚠️ Mais de um H1 (o ideal é 1 por página).")

    if p.schema_types:
        p.wins.append("✅ Dados estruturados (Schema.org) encontrados (ajuda o Google a entender a empresa/serviço).")
    else:
        p.issues.append("❌ Dados estruturados (Schema.org / JSON-LD) não encontrados.")

    # Internal links
    if p.internal_links == 0:
        p.issues.append("⚠️ Poucos ou nenhum link interno detectado (pode dificultar navegação e rastreamento).")
    elif p.internal_links < 3:
        p.issues.append("⚠️ Poucos links internos detectados — aumentar links para páginas/áreas importantes pode ajudar rastreio.")

    if p.images > 0 and p.images_missing_alt > 0:
        p.issues.append("⚠️ Existem imagens sem texto alternativo (ALT) — impacta acessibilidade e SEO de imagens.")
    else:
        p.wins.append("✅ Imagens com ALT OK (boa prática de acessibilidade/SEO).")

    if (p.og or p.twitter):
        p.wins.append("✅ Metadados sociais (OpenGraph/Twitter) presentes (melhor compartilhamento).")
    else:
        p.issues.append("⚠️ Metadados sociais (OpenGraph/Twitter) não encontrados (compartilhamento pode ficar genérico).")

    if p.word_count < 80:
        p.issues.append("⚠️ Conteúdo textual curto (pode não responder bem a intenção de busca).")

    if p.meta_robots and "noindex" in p.meta_robots.lower():
        p.issues.append("❌ A página está marcando NOINDEX (pode não aparecer no Google).")

    return p


# ----------------------------
# Scoring
# ----------------------------

def score_page(p: PageAudit) -> Tuple[int, Dict[str, int]]:
    breakdown = {k: 0 for k in ["meta", "content", "structure", "schema", "links_media", "basics_perf"]}

    # meta (25)
    meta = 0
    if p.title:
        meta += 10 if TITLE_MIN <= len(p.title) <= TITLE_MAX else 6
    if p.meta_description:
        meta += 10 if DESC_MIN <= len(p.meta_description) <= DESC_MAX else 6
    if p.canonical:
        meta += 5
    breakdown["meta"] = clamp(meta, 0, 25)

    # content (25)
    content = 0
    if p.word_count >= MIN_WORDS_OK:
        content += 12
    elif p.word_count >= 150:
        content += 8
    elif p.word_count >= 80:
        content += 4
    if len(p.h2) >= 1:
        content += 6
    if len(p.h3) >= 1:
        content += 3
    if p.lang:
        content += 4
    breakdown["content"] = clamp(content, 0, 25)

    # structure (15)
    struct = 0
    if len(p.h1) == 1:
        struct += 10
    elif len(p.h1) > 1:
        struct += 6
    if p.viewport:
        struct += 5
    breakdown["structure"] = clamp(struct, 0, 15)

    # schema (15)
    schema = 0
    if p.schema_types:
        schema = 12
        preferred = {"Organization", "LocalBusiness", "ProfessionalService", "Person", "WebSite"}
        if any(t in preferred for t in p.schema_types):
            schema = 15
    breakdown["schema"] = clamp(schema, 0, 15)

    # links/media (10)
    lm = 0
    if p.images == 0:
        lm += 2
    else:
        missing_ratio = p.images_missing_alt / max(1, p.images)
        lm += 5 if missing_ratio == 0 else (3 if missing_ratio <= 0.25 else 1)

    # internal links: anchors count, but we still want at least a few
    lm += 3 if p.internal_links >= 3 else (2 if p.internal_links >= 1 else 0)
    lm += 2 if p.external_links >= 1 else 0
    breakdown["links_media"] = clamp(lm, 0, 10)

    # basics/perf (10)
    bp = 0
    if p.status and 200 <= p.status < 300:
        bp += 4
    if p.meta_robots and "noindex" in p.meta_robots.lower():
        bp -= 4
    if p.load_time_sec < 2.0:
        bp += 6
    elif p.load_time_sec < 4.0:
        bp += 4
    elif p.load_time_sec < 6.0:
        bp += 2
    breakdown["basics_perf"] = clamp(bp, 0, 10)

    return sum(breakdown.values()), breakdown


def sector_scores(site: SiteAudit) -> Dict[str, int]:
    pages = site.pages
    if not pages:
        return {
            "Rastreabilidade & Indexação": 0,
            "Conteúdo & Estrutura": 0,
            "Dados Estruturados (Schema)": 0,
            "Links & Mídia": 0,
            "Performance (básica)": 0,
            "Social & Compartilhamento": 0,
        }

    rast = 0
    rast += 34 if site.robots_ok else 0
    rast += 33 if site.sitemap_ok else 0
    rast += 33 if site.llms_ok else 0
    rast = clamp(rast, 0, 100)

    ok_h1 = sum(1 for p in pages if len(p.h1) == 1) / len(pages)
    ok_desc = sum(1 for p in pages if p.meta_description) / len(pages)
    ok_title = sum(1 for p in pages if p.title) / len(pages)
    ok_words = sum(1 for p in pages if p.word_count >= 150) / len(pages)
    ok_lang = sum(1 for p in pages if p.lang) / len(pages)
    content = int((ok_h1*25 + ok_title*25 + ok_desc*20 + ok_words*20 + ok_lang*10))
    content = clamp(content, 0, 100)

    schema = int((sum(1 for p in pages if p.schema_types) / len(pages)) * 100)
    schema = clamp(schema, 0, 100)

    ok_alt = sum(1 for p in pages if (p.images == 0 or p.images_missing_alt == 0)) / len(pages)
    ok_internal = sum(1 for p in pages if p.internal_links >= 1) / len(pages)
    links_media = int(ok_alt*50 + ok_internal*50)
    links_media = clamp(links_media, 0, 100)

    avg = sum(p.load_time_sec for p in pages) / len(pages)
    if avg < 2.0:
        perf = 95
    elif avg < 4.0:
        perf = 85
    elif avg < 6.0:
        perf = 70
    else:
        perf = 55

    ok_social = sum(1 for p in pages if (p.og or p.twitter)) / len(pages)
    social = int(ok_social * 100)

    return {
        "Rastreabilidade & Indexação": rast,
        "Conteúdo & Estrutura": content,
        "Dados Estruturados (Schema)": schema,
        "Links & Mídia": links_media,
        "Performance (básica)": perf,
        "Social & Compartilhamento": social,
    }


def overall_score(site: SiteAudit) -> int:
    sec = sector_scores(site)
    score = (
        sec["Rastreabilidade & Indexação"] * 0.20
        + sec["Conteúdo & Estrutura"] * 0.25
        + sec["Dados Estruturados (Schema)"] * 0.20
        + sec["Links & Mídia"] * 0.15
        + sec["Performance (básica)"] * 0.10
        + sec["Social & Compartilhamento"] * 0.10
    )
    return int(round(score))


# ----------------------------
# Crawl
# ----------------------------

def discover_internal_links(final_url: str, soup: BeautifulSoup, max_new: int = 60) -> List[str]:
    links: List[str] = []
    for a in soup.find_all("a", href=True):
        href = (a.get("href") or "").strip()
        if not href or href.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        absu = norm_url(urljoin(final_url, href))
        if same_host(final_url, absu):
            links.append(absu)
        if len(links) >= max_new:
            break
    return links


async def run_audit(start_url: str, max_pages: int, timeout_sec: int, cookie_accept_text: str) -> SiteAudit:
    start_url = norm_url(start_url)
    h = host(start_url)
    base = f"{urlparse(start_url).scheme}://{h}"

    site = SiteAudit(start_url=start_url, host=h)
    site.robots_url = f"{base}/robots.txt"
    site.sitemap_url = f"{base}/sitemap.xml"
    site.llms_url = f"{base}/llms.txt"

    timeout_ms = timeout_sec * 1000

    visited: Set[str] = set()
    queue: List[str] = [start_url]

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(user_agent=USER_AGENT)
        page = await context.new_page()

        site.robots_ok = await check_endpoint_ok(page, site.robots_url, timeout_ms)
        site.sitemap_ok = await check_endpoint_ok(page, site.sitemap_url, timeout_ms)
        site.llms_ok = await check_endpoint_ok(page, site.llms_url, timeout_ms)

        while queue and len(site.pages) < max_pages:
            url = queue.pop(0)
            url = norm_url(url)
            if url in visited:
                continue
            visited.add(url)

            try:
                status, final_url, load_time, html, jsonld_blocks, hrefs, link_rel_data = await fetch_page_dom(
                    page, url, timeout_ms, cookie_accept_text=cookie_accept_text
                )
            except Exception:
                pd = PageAudit(url=url, final_url=url, status=0, load_time_sec=0.0)
                pd.issues.append("⚠️ Não foi possível carregar a página no modo navegador (verificar disponibilidade).")
                site.pages.append(pd)
                continue

            pd = audit_from_dom(url, final_url, status, load_time, html, jsonld_blocks, hrefs, link_rel_data)
            site.pages.append(pd)

            soup = BeautifulSoup(html, "lxml")
            new_links = discover_internal_links(final_url, soup, max_new=80)
            for lk in new_links:
                if lk not in visited and lk not in queue and same_host(start_url, lk):
                    queue.append(lk)

        await browser.close()

    return site


# ----------------------------
# Report (NO code)
# ----------------------------

def build_site_actions(site: SiteAudit) -> List[str]:
    actions: List[str] = []

    if site.robots_ok is False:
        actions.append("Criar/ajustar o arquivo robots.txt para orientar robôs de busca.")
    if site.sitemap_ok is False:
        actions.append("Criar/ajustar o sitemap.xml para facilitar rastreamento e indexação.")
    if site.llms_ok is False:
        actions.append("Adicionar llms.txt para melhorar leitura por IAs e mecanismos modernos (GEO/AI Search).")

    pages = site.pages
    if any(not p.schema_types for p in pages):
        actions.append("Adicionar/ajustar dados estruturados (Schema.org/JSON-LD) nas páginas principais (Empresa/Serviço/Site).")
    if any(p.internal_links < 3 for p in pages):
        actions.append("Adicionar mais links internos (menu/CTAs) apontando para páginas ou seções importantes.")
    if any((p.images > 0 and p.images_missing_alt > 0) for p in pages):
        actions.append("Garantir texto ALT em todas as imagens importantes (logo, banners, ilustrações).")

    out: List[str] = []
    seen: Set[str] = set()
    for a in actions:
        if a not in seen:
            seen.add(a)
            out.append(a)
    return out


def write_report(site: SiteAudit, out_path: str) -> None:
    sec = sector_scores(site)
    overall = overall_score(site)
    letter, label = grade(overall)
    actions = build_site_actions(site)

    lines: List[str] = []
    lines.append(f"# Relatório SEO — {site.host}")
    lines.append("")
    lines.append(f"**Data:** {now_str()}")
    lines.append(f"**URL analisada:** {site.start_url}")
    lines.append(f"**Páginas analisadas:** {len(site.pages)}")
    lines.append("**Modo de leitura:** Navegador (renderiza JavaScript, semelhante ao Google moderno)")
    lines.append("")
    lines.append("## ✅ Nota Geral")
    lines.append("")
    lines.append(f"**{overall}/100 — {letter} ({label})**")
    lines.append("")
    lines.append("## 📊 Notas por Setor")
    lines.append("")
    for k, v in sec.items():
        l, lab = grade(v)
        lines.append(f"- **{k}: {v}/100 — {l} ({lab})**")
    lines.append("")
    lines.append("## 🧾 Resumo Executivo")
    lines.append("")
    lines.append("Este documento avalia fatores técnicos e de conteúdo que influenciam rastreamento, indexação e qualidade de apresentação nos resultados de busca.")
    lines.append("As recomendações estão em linguagem não-técnica e focam em ações práticas.")
    lines.append("")
    lines.append("## 1) 🕷️ Rastreabilidade & Indexação")
    lines.append("")
    lines.append(f"- {ok_icon(bool(site.robots_ok))} **robots.txt**: {site.robots_url}")
    lines.append(f"- {ok_icon(bool(site.sitemap_ok))} **sitemap.xml**: {site.sitemap_url}")
    lines.append(f"- {ok_icon(bool(site.llms_ok))} **llms.txt**: {site.llms_url}")
    lines.append("")
    lines.append("## 2) 🎯 Ações Recomendadas (Prioridade)")
    lines.append("")
    if actions:
        for i, a in enumerate(actions, 1):
            lines.append(f"{i}. {a}")
    else:
        lines.append("✅ Nenhuma ação crítica foi detectada nos checks automáticos.")
    lines.append("")
    lines.append("## 3) 📄 Visão por Página")
    lines.append("")
    lines.append("| Página | Status | Tempo | Title | Description | Canonical | H1 | Schema | Links internos | Âncoras |")
    lines.append("|---|---:|---:|---|---|---|---:|---|---:|---:|")
    for p in site.pages:
        t = f"{p.load_time_sec:.2f}s" if p.load_time_sec else "-"
        lines.append(
            f"| {p.url} | {p.status or '-'} | {t} | {ok_icon(bool(p.title))} | {ok_icon(bool(p.meta_description))} | {ok_icon(bool(p.canonical))} | {len(p.h1)} | {ok_icon(bool(p.schema_types))} | {p.internal_links} | {p.anchor_links} |"
        )
    lines.append("")
    lines.append("## 4) 🔎 Achados Detalhados")
    lines.append("")
    for p in site.pages:
        score, _ = score_page(p)
        ltr, lab = grade(score)
        lines.append(f"### {p.url}")
        lines.append("")
        lines.append(f"- **Status:** {p.status or '-'}")
        lines.append(f"- **Tempo aprox.:** {p.load_time_sec:.2f}s" if p.load_time_sec else "- **Tempo aprox.:** -")
        lines.append(f"- **Nota da página:** **{score}/100 — {ltr} ({lab})**")
        lines.append("")
        lines.append("**✅ O que está bom:**")
        if p.wins:
            for w in p.wins[:12]:
                lines.append(f"- {w}")
        else:
            lines.append("- ✅ Nenhum ponto positivo automático identificado (raro).")
        lines.append("")
        lines.append("**⚠️ O que melhorar:**")
        if p.issues:
            for it in p.issues[:15]:
                lines.append(f"- {it}")
        else:
            lines.append("- ✅ Nenhum problema automático encontrado.")
        lines.append("")
        lines.append("**📌 Sinais encontrados:**")
        lines.append(f"- **Title:** {md_escape(p.title) if p.title else '—'}")
        lines.append(f"- **Description:** {md_escape(p.meta_description) if p.meta_description else '—'}")
        lines.append(f"- **Canonical:** {p.canonical if p.canonical else '—'}")
        lines.append(f"- **Lang:** {p.lang if p.lang else '—'} | **Viewport:** {ok_icon(bool(p.viewport))}")
        lines.append(f"- **Estrutura (H1/H2/H3):** {len(p.h1)}/{len(p.h2)}/{len(p.h3)}")
        lines.append(f"- **Conteúdo (aprox.):** {p.word_count} palavras")
        lines.append(f"- **Links:** internos={p.internal_links} (âncoras={p.anchor_links}), externos={p.external_links}, nofollow={p.nofollow_links}")
        lines.append(f"- **Imagens:** {p.images} | sem ALT={p.images_missing_alt}")
        lines.append(f"- **Schema:** {', '.join(p.schema_types) if p.schema_types else '—'}")
        lines.append("")

    lines.append("## 5) ℹ️ Observações Importantes")
    lines.append("")
    lines.append("- Esta análise usa renderização por navegador, semelhante ao que mecanismos modernos fazem para páginas com JavaScript.")
    lines.append("- A pontuação é heurística: ajuda a priorizar melhorias, não garante posição no Google.")
    lines.append("")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


# ----------------------------
# CLI
# ----------------------------

async def main_async():
    parser = argparse.ArgumentParser(description="SEO audit (client-ready) -> seo-report.md")
    parser.add_argument("url", help="URL inicial (ex: https://www.caiofrota.com/)")
    parser.add_argument("--max-pages", type=int, default=10, help="Limite de páginas para análise (default: 10)")
    parser.add_argument("--timeout", type=int, default=25, help="Timeout de carregamento por página em segundos (default: 25)")
    parser.add_argument("--out", default="seo-report.md", help="Arquivo de saída Markdown (default: seo-report.md)")
    parser.add_argument("--cookie-accept-text", default="", help='Texto do botão de cookies (ex: "Accept"). Opcional.')
    args = parser.parse_args()

    site = await run_audit(args.url, max_pages=args.max_pages, timeout_sec=args.timeout, cookie_accept_text=args.cookie_accept_text)
    write_report(site, args.out)
    print(f"OK: relatório gerado em {args.out}")


def main():
    asyncio.run(main_async())


if __name__ == "__main__":
    main()
