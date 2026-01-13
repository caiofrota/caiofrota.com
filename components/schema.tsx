// app/components/SchemaOrg.tsx
// Fully customizable Schema.org JSON-LD injector for Next.js (App Router).
// - Pass ANY JSON-LD objects via `nodes`
// - Optionally provide sensible defaults (Organization + WebSite + WebPage)
// - Deep-merge overrides, add/remove, and control script strategy
//
// Usage examples are below.

import Script from "next/script";

type JsonLd = Record<string, any>;

function isObject(v: any): v is Record<string, any> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** Deep merge where arrays are replaced (not concatenated) by default. */
function deepMerge(base: any, override: any): any {
  if (!isObject(base) || !isObject(override)) return override;

  const out: Record<string, any> = { ...base };
  for (const key of Object.keys(override)) {
    const b = (base as any)[key];
    const o = (override as any)[key];

    if (Array.isArray(o)) {
      out[key] = o; // replace arrays
    } else if (isObject(b) && isObject(o)) {
      out[key] = deepMerge(b, o);
    } else {
      out[key] = o;
    }
  }
  return out;
}

function asArray<T>(v?: T | T[]): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export type SchemaOrgConfig = {
  /** Optional global @context; defaults to https://schema.org */
  context?: string;

  /** Script loading strategy (Next.js). Default: afterInteractive */
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload" | "worker";

  /**
   * Provide your own raw JSON-LD objects.
   * If set, they will be included in the output (in addition to defaults if enabled).
   */
  nodes?: JsonLd | JsonLd[];

  /**
   * Enable/disable built-in defaults (Organization + WebSite + WebPage).
   * Default: true
   */
  enableDefaults?: boolean;

  /**
   * Base defaults configuration. You can override any field in the default nodes here.
   * This is deep-merged into the built-in defaults.
   */
  defaults?: {
    organization?: JsonLd; // overrides for Organization
    website?: JsonLd; // overrides for WebSite
    webpage?: JsonLd; // overrides for WebPage
  };

  /**
   * Optional: remove specific default node types completely.
   * Example: ["WebPage"] to skip WebPage defaults.
   */
  disableDefaultTypes?: Array<"Organization" | "WebSite" | "WebPage">;

  /**
   * Optional: post-process nodes before rendering (e.g., filter, add IDs, etc.).
   */
  transform?: (nodes: JsonLd[]) => JsonLd[];

  /**
   * Optional: custom id prefix to keep Script ids stable.
   * Default: "schemaorg"
   */
  idPrefix?: string;

  /**
   * Optional: pretty print JSON for easier debugging (slightly larger payload)
   * Default: false
   */
  pretty?: boolean;
};

export type SchemaOrgProps = {
  /**
   * Canonical URL of the current page.
   * Used only by default WebPage node.
   */
  canonicalUrl?: string;

  /**
   * Current language tag (e.g., "pt-BR", "en", "en-US").
   * Used only by default WebPage node.
   */
  lang?: string;

  /**
   * Alternate language URLs for this same page (optional).
   * Used only by default WebPage node.
   */
  alternates?: Array<{ url: string; inLanguage: string }>;

  /**
   * Optional WebPage title/description (default WebPage node only).
   */
  pageTitle?: string;
  pageDescription?: string;

  /**
   * Default identity anchors (used by default nodes)
   * Provide stable @id values for Organization and WebSite.
   */
  ids?: {
    organizationId?: string; // default: `${siteUrl}/#organization`
    websiteId?: string; // default: `${siteUrl}/#website`
  };

  /**
   * Minimal "site" configuration used by default nodes.
   * If you disable defaults, you don't need these.
   */
  site?: {
    url: string; // e.g., https://www.cfinovatech.com
    name?: string; // e.g., CF Inova Tech
    logoUrl?: string; // e.g., https://.../logo.png
    email?: string; // e.g., contato@...
    sameAs?: string[]; // social links
    availableLanguages?: string[]; // e.g., ["pt-BR", "en"]
  };

  /** High-level configuration */
  config?: SchemaOrgConfig;
};

function buildDefaultNodes(props: SchemaOrgProps, config: SchemaOrgConfig): JsonLd[] {
  const context = config.context ?? "https://schema.org";
  const siteUrl = props.site?.url;
  if (!siteUrl) return []; // cannot build defaults without site url

  const organizationId = props.ids?.organizationId ?? `${siteUrl}/#organization`;
  const websiteId = props.ids?.websiteId ?? `${siteUrl}/#website`;

  const org: JsonLd = {
    "@context": context,
    "@type": "Organization",
    "@id": organizationId,
    ...(props.site?.name ? { name: props.site.name } : {}),
    url: siteUrl,
    ...(props.site?.email ? { email: props.site.email } : {}),
    ...(props.site?.logoUrl ? { logo: props.site.logoUrl } : {}),
    ...(props.site?.sameAs?.length ? { sameAs: props.site.sameAs } : {}),
    ...(props.site?.availableLanguages?.length
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              ...(props.site?.email ? { email: props.site.email } : {}),
              availableLanguage: props.site.availableLanguages,
            },
          ],
        }
      : {}),
  };

  const website: JsonLd = {
    "@context": context,
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    ...(props.site?.name ? { name: props.site.name } : {}),
    publisher: { "@id": organizationId },
    ...(props.site?.availableLanguages?.length ? { inLanguage: props.site.availableLanguages } : {}),
  };

  const webpage: JsonLd | null = props.canonicalUrl
    ? {
        "@context": context,
        "@type": "WebPage",
        "@id": `${props.canonicalUrl}#webpage`,
        url: props.canonicalUrl,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        publisher: { "@id": organizationId },
        ...(props.lang ? { inLanguage: props.lang } : {}),
        ...(props.pageTitle ? { name: props.pageTitle } : {}),
        ...(props.pageDescription ? { description: props.pageDescription } : {}),
        ...(props.alternates?.length
          ? {
              workTranslation: props.alternates.map((a) => ({
                "@type": "WebPage",
                url: a.url,
                inLanguage: a.inLanguage,
              })),
            }
          : {}),
      }
    : null;

  const disabled = new Set(config.disableDefaultTypes ?? []);

  const nodes: JsonLd[] = [];
  if (!disabled.has("Organization")) nodes.push(org);
  if (!disabled.has("WebSite")) nodes.push(website);
  if (webpage && !disabled.has("WebPage")) nodes.push(webpage);

  // Deep-merge per-node overrides
  const ovrOrg = config.defaults?.organization;
  const ovrWeb = config.defaults?.website;
  const ovrPage = config.defaults?.webpage;

  return nodes.map((n) => {
    if (n["@type"] === "Organization" && ovrOrg) return deepMerge(n, ovrOrg);
    if (n["@type"] === "WebSite" && ovrWeb) return deepMerge(n, ovrWeb);
    if (n["@type"] === "WebPage" && ovrPage) return deepMerge(n, ovrPage);
    return n;
  });
}

export default function SchemaOrg(props: SchemaOrgProps) {
  const cfg: SchemaOrgConfig = {
    enableDefaults: true,
    strategy: "afterInteractive",
    idPrefix: "schemaorg",
    pretty: false,
    ...props.config,
  };

  const customNodes = asArray(cfg.nodes);
  const defaultNodes = cfg.enableDefaults ? buildDefaultNodes(props, cfg) : [];

  let nodes = [...defaultNodes, ...customNodes];

  // Optional transform hook
  if (cfg.transform) nodes = cfg.transform(nodes);

  // If nothing to render, render nothing
  if (!nodes.length) return null;

  const json = (obj: any) => (cfg.pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj));

  return (
    <>
      {nodes.map((obj, idx) => (
        <Script
          key={`${cfg.idPrefix}-${idx}`}
          id={`${cfg.idPrefix}-${idx}`}
          type="application/ld+json"
          strategy={cfg.strategy}
          dangerouslySetInnerHTML={{ __html: json(obj) }}
        />
      ))}
    </>
  );
}
