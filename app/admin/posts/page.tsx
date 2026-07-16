import { Plus } from "lucide-react";
import { AdminBadge, AdminPageHeader, AdminPanel } from "components/admin/admin-ui";
import { PostsTable, type PostTableRow } from "components/admin/resource-tables";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { publicMediaUrl } from "lib/storage";
import { createArticle } from "./actions";

export default async function PostsPage() {
  await requireAdmin();
  const articles = await prisma.article.findMany({
    include: {
      translations: { include: { coverImage: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  const rows: PostTableRow[] = articles.map((article) => {
    const br = article.translations.find((item) => item.locale === "PT_BR");
    const en = article.translations.find((item) => item.locale === "EN_US");
    const coverImage = br?.coverImage ?? en?.coverImage;
    const title = br?.title || en?.title || "Artigo sem título";
    const isPublished = br?.status === "PUBLISHED" && en?.status === "PUBLISHED";

    return {
      id: article.id,
      title,
      secondaryTitle: en?.title && en.title !== title ? en.title : null,
      coverUrl: publicMediaUrl(coverImage) ?? null,
      status: isPublished ? "PUBLISHED" : "DRAFT",
      br: br
        ? {
            complete: Boolean(br.title.trim() && br.slug.trim()),
            publicUrl: isPublished && br.slug ? `/br/blog/${br.slug}` : null,
          }
        : null,
      en: en
        ? {
            complete: Boolean(en.title.trim() && en.slug.trim()),
            publicUrl: isPublished && en.slug ? `/en/blog/${en.slug}` : null,
          }
        : null,
      updatedAt: article.updatedAt.toISOString(),
    };
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Blog"
        title="Artigos"
        description="Edite, traduza e acompanhe o estado de publicação de cada conteúdo."
        actions={
          <form action={createArticle}>
            <button className="button-primary inline-flex cursor-pointer items-center gap-2">
              <Plus className="size-4" aria-hidden="true" />
              Novo artigo
            </button>
          </form>
        }
      />

      <AdminPanel className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-site-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-bold text-site-heading">Todos os artigos</h2>
            <p className="mt-1 text-xs text-site-muted">Clique nos cabeçalhos para ordenar e use as ações rápidas para gerenciar.</p>
          </div>
          <AdminBadge tone="accent">{rows.length}</AdminBadge>
        </div>
        <PostsTable rows={rows} />
      </AdminPanel>
    </div>
  );
}
