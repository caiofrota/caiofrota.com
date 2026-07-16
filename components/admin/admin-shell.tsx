"use client";

import { ExternalLink, FileText, FolderTree, Images, LayoutDashboard, LogOut, Menu, Tags, X, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAdmin } from "app/admin/actions";
import { ConfirmActionButton } from "components/admin/confirm-action-button";
import { ThemeSwitch } from "components/theme-switch";

type AdminUser = {
  name: string;
  email: string;
};

type NavigationItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  { href: "/admin", label: "Visão geral", description: "Resumo editorial", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", description: "Artigos e rascunhos", icon: FileText },
  { href: "/admin/categories", label: "Categorias", description: "Organização principal", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", description: "Assuntos e filtros", icon: Tags },
  { href: "/admin/media", label: "Mídia", description: "Imagens e arquivos", icon: Images },
];

function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Brand({ onNavigate, compact = false }: { onNavigate?: () => void; compact?: boolean }) {
  return (
    <Link href="/admin" onClick={onNavigate} className="cf-ring group flex items-center gap-3 rounded-xl">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-700 text-sm font-black tracking-[-0.04em] text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950">
        CF
      </span>
      <span className={`min-w-0 ${compact ? "hidden min-[390px]:block" : ""}`}>
        <span className="block truncate text-sm font-extrabold tracking-tight text-site-heading">Caio Frota</span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-site-muted">Painel editorial</span>
      </span>
    </Link>
  );
}

function Navigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Navegação do painel" className="space-y-1">
      {navigation.map(({ href, label, description, icon: Icon }) => {
        const active = isActivePath(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`cf-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
              active
                ? "bg-cyan-700 text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950"
                : "text-site-foreground hover:bg-site-surface-hover hover:text-site-heading"
            }`}
          >
            <Icon className={`size-4.5 shrink-0 ${active ? "" : "text-site-muted group-hover:text-site-accent"}`} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight">{label}</span>
              <span className={`mt-0.5 block text-[11px] leading-tight ${active ? "opacity-75" : "text-site-muted"}`}>{description}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function Account({ user }: { user: AdminUser }) {
  return (
    <div className="rounded-2xl border border-site-border bg-site-surface p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-site-surface-strong text-xs font-extrabold text-site-heading ring-1 ring-site-border">
          {initials(user.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-site-heading">{user.name}</span>
          <span className="block truncate text-[11px] text-site-muted">{user.email}</span>
        </span>
        <ConfirmActionButton
          action={logoutAdmin}
          icon={LogOut}
          triggerLabel="Sair do painel"
          title="Encerrar esta sessão?"
          description="Você será desconectado do painel editorial e precisará informar suas credenciais para entrar novamente."
          confirmLabel="Encerrar sessão"
          tone="danger"
        />
      </div>
    </div>
  );
}

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentItem = navigation.find((item) => isActivePath(pathname, item.href)) ?? navigation[0];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="relative min-h-screen bg-site-canvas text-site-foreground">
      <div className="site-grid pointer-events-none fixed inset-0 opacity-35" aria-hidden="true" />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-site-border bg-site-nav px-4 py-5 backdrop-blur-xl lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <div className="my-5 h-px bg-site-border" />
        <Navigation pathname={pathname} />
        <div className="mt-auto space-y-3 pt-6">
          <Link
            href="/br"
            target="_blank"
            rel="noreferrer"
            className="cf-ring flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-site-muted transition hover:bg-site-surface-hover hover:text-site-heading"
          >
            Ver site
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
          <Account user={user} />
        </div>
      </aside>

      <div className="relative min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-site-border bg-site-nav/95 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
            <div className="lg:hidden">
              <Brand compact />
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-sm font-bold text-site-heading">{currentItem.label}</p>
              <p className="truncate text-xs text-site-muted">{currentItem.description}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/br"
                target="_blank"
                rel="noreferrer"
                className="cf-ring hidden items-center gap-2 rounded-xl border border-site-border bg-site-surface px-3 py-2 text-xs font-bold text-site-heading transition hover:bg-site-surface-hover sm:inline-flex"
              >
                Ver site
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </Link>
              <ThemeSwitch locale="br" />
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="cf-ring grid size-10 place-items-center rounded-xl border border-site-border bg-site-surface text-site-heading transition hover:bg-site-surface-hover lg:hidden"
                aria-label="Abrir menu"
                aria-expanded={menuOpen}
                aria-controls="admin-mobile-navigation"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
          tabIndex={menuOpen ? 0 : -1}
        />
        <aside
          id="admin-mobile-navigation"
          aria-label="Menu do painel"
          aria-modal="true"
          role="dialog"
          className={`absolute inset-y-0 right-0 flex w-[min(21rem,calc(100%-2rem))] flex-col border-l border-site-border bg-site-canvas p-5 shadow-2xl transition-transform duration-200 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Brand onNavigate={() => setMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="cf-ring grid size-10 shrink-0 place-items-center rounded-xl border border-site-border bg-site-surface text-site-heading"
              aria-label="Fechar menu"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="my-5 h-px bg-site-border" />
          <Navigation pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          <div className="mt-auto space-y-3 pt-6">
            <Link
              href="/br"
              target="_blank"
              rel="noreferrer"
              className="cf-ring flex items-center justify-between rounded-xl border border-site-border bg-site-surface px-3 py-2.5 text-sm font-bold text-site-heading"
            >
              Ver site
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
            <Account user={user} />
          </div>
        </aside>
      </div>
    </div>
  );
}
