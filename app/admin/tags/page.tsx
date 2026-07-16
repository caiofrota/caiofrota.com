import { Plus } from "lucide-react";
import { AdminBadge, adminInputClass, adminLabelClass, AdminPageHeader, AdminPanel } from "components/admin/admin-ui";
import { TagsTable, type TagTableRow } from "components/admin/resource-tables";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { createTag } from "../taxonomy-actions";

export default async function TagsPage() {
  await requireAdmin();
  const tags = await prisma.tag.findMany({
    include: {
      translations: {
        include: { _count: { select: { articles: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows: TagTableRow[] = tags.map((tag) => {
    const br = tag.translations.find((item) => item.locale === "PT_BR");
    const en = tag.translations.find((item) => item.locale === "EN_US");

    return {
      id: tag.id,
      br: br ? { name: br.name, slug: br.slug, articleCount: br._count.articles } : null,
      en: en ? { name: en.name, slug: en.slug, articleCount: en._count.articles } : null,
      articleCount: Math.max(br?._count.articles ?? 0, en?._count.articles ?? 0),
      updatedAt: tag.updatedAt.toISOString(),
    };
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Taxonomia"
        title="Tags"
        description="Crie marcadores específicos para conectar conteúdos relacionados e facilitar a descoberta."
      />

      <AdminPanel>
        <form action={createTag} className="p-5 sm:p-6">
          <div>
            <h2 className="font-bold text-site-heading">Nova tag</h2>
            <p className="mt-1 text-xs leading-5 text-site-muted">Cadastre as duas traduções juntas para manter o blog bilíngue.</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
            <label className={adminLabelClass}>
              Nome em português
              <input name="br" required placeholder="Ex.: Performance" className={adminInputClass} />
            </label>
            <label className={adminLabelClass}>
              Name in English
              <input name="en" required placeholder="E.g. Performance" className={adminInputClass} />
            </label>
            <button className="button-primary inline-flex cursor-pointer items-center justify-center gap-2 md:mb-px">
              <Plus className="size-4" aria-hidden="true" />
              Adicionar
            </button>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-site-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-bold text-site-heading">Tags cadastradas</h2>
            <p className="mt-1 text-xs text-site-muted">Ordene, consulte o uso e remova marcadores sem sair da lista.</p>
          </div>
          <AdminBadge tone="accent">{rows.length}</AdminBadge>
        </div>
        <TagsTable rows={rows} />
      </AdminPanel>
    </div>
  );
}
