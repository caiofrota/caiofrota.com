import { AlertCircle, ArrowLeft, LockKeyhole } from "lucide-react";
import { ThemeSwitch } from "components/theme-switch";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "lib/auth";
import { env } from "lib/env";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [user, query] = await Promise.all([getCurrentUser(), searchParams]);
  if (user?.role === "ADMIN") redirect("/admin");

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden p-5 sm:p-8 lg:p-10">
      <div className="site-grid pointer-events-none absolute inset-0 opacity-55" aria-hidden="true" />

      <div className="relative flex items-center justify-between gap-4">
        <Link
          href="/br"
          className="cf-ring inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-site-muted transition hover:text-site-heading"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar ao site
        </Link>
        <ThemeSwitch locale="br" />
      </div>

      <div className="relative my-auto flex w-full justify-center py-10">
        <form
          action="/api/auth/login"
          method="post"
          className="w-full max-w-md rounded-3xl border border-site-border bg-site-surface p-6 shadow-[0_24px_70px_rgb(15_23_42/0.10)] backdrop-blur-xl sm:p-8"
        >
          <span className="grid size-11 place-items-center rounded-2xl border border-site-border bg-site-surface-strong text-site-accent">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-2xl font-black tracking-[-0.035em] text-site-heading sm:text-3xl">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm leading-6 text-site-muted">Use suas credenciais administrativas para continuar.</p>

          {!env.DATABASE_URL && (
            <div
              className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-bold">Banco ainda não configurado</p>
                  <p className="mt-1.5 leading-6 opacity-85">
                    Copie <code>.env.example</code> para <code>.env</code>, defina <code>SESSION_SECRET</code> e rode{" "}
                    <code>pnpm db:up</code>, <code>pnpm db:migrate</code> e <code>pnpm admin:create</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {query.error && (
            <div
              className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200"
              role="alert"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>E-mail ou senha inválidos. Confira os dados e tente novamente.</span>
            </div>
          )}

          <div className="mt-7 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-site-heading">E-mail</span>
              <input
                required
                name="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                autoFocus
                placeholder="voce@exemplo.com"
                className="cf-ring mt-2 w-full rounded-xl border border-site-border bg-site-surface-strong px-3.5 py-3 text-sm text-site-heading placeholder:text-site-muted/70"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-site-heading">Senha</span>
              <input
                required
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Sua senha"
                className="cf-ring mt-2 w-full rounded-xl border border-site-border bg-site-surface-strong px-3.5 py-3 text-sm text-site-heading placeholder:text-site-muted/70"
              />
            </label>
          </div>

          <button className="button-primary mt-7 w-full py-3" disabled={!env.DATABASE_URL}>
            Entrar no painel
          </button>
          <p className="mt-5 text-center text-xs leading-5 text-site-muted">Este painel é exclusivo para usuários autorizados.</p>
        </form>
      </div>
    </main>
  );
}
