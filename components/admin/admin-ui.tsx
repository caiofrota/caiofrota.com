import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const adminInputClass =
  "cf-ring mt-2 w-full rounded-xl border border-site-border bg-site-surface-strong px-3.5 py-2.5 text-sm text-site-heading shadow-sm transition placeholder:text-site-muted/70 hover:border-site-accent/50";

export const adminLabelClass = "block text-sm font-semibold text-site-heading";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.035em] text-site-heading sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-xl text-sm leading-6 text-site-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function AdminPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-site-border bg-site-surface shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm ${className}`}
    >
      {children}
    </section>
  );
}

export function AdminBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "accent" }) {
  const tones = {
    neutral: "border-site-border bg-site-surface-strong text-site-muted",
    success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    accent: "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl border border-site-border bg-site-surface-strong text-site-accent">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-bold text-site-heading">{title}</h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-site-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function AdminStatCard({
  href,
  icon: Icon,
  value,
  label,
  hint,
}: {
  href: string;
  icon: LucideIcon;
  value: number | string;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-site-border bg-site-surface p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-site-accent/40 hover:bg-site-surface-hover"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-site-muted">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-site-heading">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-cyan-600/10 text-site-accent transition group-hover:bg-cyan-600/15">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-xs leading-5 text-site-muted">{hint}</p>
    </Link>
  );
}
