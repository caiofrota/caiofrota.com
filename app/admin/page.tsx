import { ArrowRight, Clock3, FileCheck2, FileText, FolderTree, Image as ImageIcon, Languages, Plus, Tags } from "lucide-react";
import Link from "next/link";
import { AdminBadge, AdminEmptyState, AdminPageHeader, AdminPanel, AdminStatCard } from "components/admin/admin-ui";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { createArticle } from "./posts/actions";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminPage() {
  await requireAdmin();

  const [articleCount, mediaCount, categoryCount, tagCount, articleStates, recentArticles] = await Promise.all([
    prisma.article.count(),
    prisma.mediaAsset.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.article.findMany({
      select: {
        translations: { select: { locale: true, status: true, title: true, slug: true } },
      },
    }),
    prisma.article.findMany({
      include: { translations: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  const publishedArticleCount = articleStates.filter((article) => isFullyPublished(article.translations)).length;
  const draftArticleCount = articleCount - publishedArticleCount;
  const completeArticleCount = articleStates.filter((article) => isBilingualComplete(article.translations)).length;
  const incompleteArticleCount = articleCount - completeArticleCount;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Visão geral"
        title="Painel editorial"
        description="Acompanhe o conteúdo nas duas línguas e retome rapidamente o que precisa de atenção."
        actions={
          <>
            <Link href="/br/blog" className="button-secondary inline-flex items-center gap-2">
              Ver blog
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <form action={createArticle}>
              <button className="button-primary inline-flex cursor-pointer items-center gap-2">
                <Plus className="size-4" aria-hidden="true" />
                Novo artigo
              </button>
            </form>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo editorial">
        <AdminStatCard
          href="/admin/posts"
          icon={FileText}
          value={articleCount}
          label="Artigos"
          hint={`${articleCount === 1 ? "1 conteúdo bilíngue" : `${articleCount} conteúdos bilíngues`} no total`}
        />
        <AdminStatCard
          href="/admin/posts"
          icon={FileCheck2}
          value={publishedArticleCount}
          label="Artigos publicados"
          hint="Com as duas versões disponíveis publicamente"
        />
        <AdminStatCard
          href="/admin/posts"
          icon={Clock3}
          value={draftArticleCount}
          label="Artigos em rascunho"
          hint="Ainda precisam de revisão ou publicação"
        />
        <AdminStatCard
          href="/admin/media"
          icon={ImageIcon}
          value={mediaCount}
          label="Arquivos de mídia"
          hint="Imagens disponíveis na biblioteca"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.85fr)]">
        <AdminPanel className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-site-border px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold text-site-heading">Atualizados recentemente</h2>
              <p className="mt-1 text-xs text-site-muted">Os últimos artigos movimentados no editor.</p>
            </div>
            <Link href="/admin/posts" className="cf-ring rounded-lg text-sm font-semibold text-site-accent hover:underline">
              Ver todos
            </Link>
          </div>

          {recentArticles.length ? (
            <div className="divide-y divide-site-border">
              {recentArticles.map((article) => {
                const br = article.translations.find((item) => item.locale === "PT_BR");
                const en = article.translations.find((item) => item.locale === "EN_US");
                const title = br?.title || en?.title || "Artigo sem título";
                const published = isFullyPublished(article.translations);

                return (
                  <Link
                    key={article.id}
                    href={`/admin/posts/${article.id}`}
                    className="group flex items-center gap-4 px-5 py-4 transition hover:bg-site-surface-hover sm:px-6"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-600/10 text-site-accent">
                      <FileText className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-site-heading group-hover:text-site-accent">{title}</p>
                      <div className="mt-1.5">
                        <AdminBadge tone={published ? "success" : "warning"}>{published ? "Publicado" : "Rascunho"}</AdminBadge>
                      </div>
                    </div>
                    <time className="hidden shrink-0 text-xs text-site-muted sm:block" dateTime={article.updatedAt.toISOString()}>
                      {dateFormatter.format(article.updatedAt)}
                    </time>
                    <ArrowRight
                      className="size-4 shrink-0 text-site-muted transition group-hover:translate-x-0.5 group-hover:text-site-accent"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <AdminEmptyState
              icon={FileText}
              title="Nenhum artigo criado"
              description="Crie o primeiro conteúdo para começar a publicar em português e inglês."
              action={
                <form action={createArticle}>
                  <button className="button-primary inline-flex cursor-pointer items-center gap-2">
                    <Plus className="size-4" aria-hidden="true" />
                    Criar artigo
                  </button>
                </form>
              }
            />
          )}
        </AdminPanel>

        <div className="space-y-6">
          <AdminPanel className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-cyan-600/10 text-site-accent">
                <Languages className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-bold text-site-heading">Cobertura bilíngue</h2>
                <p className="text-xs text-site-muted">Completude de cada artigo.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <CoverageStatus label="Artigos completos" value={completeArticleCount} tone="success" />
              <CoverageStatus label="Artigos pendentes" value={incompleteArticleCount} tone="warning" />
            </div>
          </AdminPanel>

          <AdminPanel className="overflow-hidden">
            <div className="border-b border-site-border px-5 py-4">
              <h2 className="font-bold text-site-heading">Organização</h2>
              <p className="mt-1 text-xs text-site-muted">Atalhos para estruturar o conteúdo.</p>
            </div>
            <QuickLink href="/admin/categories" icon={FolderTree} label="Categorias" value={categoryCount} />
            <QuickLink href="/admin/tags" icon={Tags} label="Tags" value={tagCount} />
            <QuickLink href="/admin/media" icon={ImageIcon} label="Biblioteca de mídia" value={mediaCount} />
          </AdminPanel>
        </div>
      </div>
    </div>
  );
}

function CoverageStatus({ label, value, tone }: { label: string; value: number; tone: "success" | "warning" }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-site-border bg-site-surface-strong p-3.5">
      <p className="text-sm font-semibold text-site-heading">{label}</p>
      <AdminBadge tone={tone}>{value}</AdminBadge>
    </div>
  );
}

function isFullyPublished(translations: Array<{ locale: string; status: string }>) {
  return ["PT_BR", "EN_US"].every((locale) =>
    translations.some((translation) => translation.locale === locale && translation.status === "PUBLISHED"),
  );
}

function isBilingualComplete(translations: Array<{ locale: string; title: string; slug: string }>) {
  return ["PT_BR", "EN_US"].every((locale) =>
    translations.some((translation) => translation.locale === locale && translation.title.trim() && translation.slug.trim()),
  );
}

function QuickLink({ href, icon: Icon, label, value }: { href: string; icon: typeof FolderTree; label: string; value: number }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 border-b border-site-border px-5 py-4 last:border-b-0 hover:bg-site-surface-hover"
    >
      <Icon className="size-4 text-site-accent" aria-hidden="true" />
      <span className="flex-1 text-sm font-semibold text-site-heading">{label}</span>
      <AdminBadge>{value}</AdminBadge>
      <ArrowRight
        className="size-4 text-site-muted transition group-hover:translate-x-0.5 group-hover:text-site-accent"
        aria-hidden="true"
      />
    </Link>
  );
}
