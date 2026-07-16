import { Plus } from "lucide-react";
import { AdminBadge, adminInputClass, adminLabelClass, AdminPageHeader, AdminPanel } from "components/admin/admin-ui";
import { CategoriesTable, type CategoryTableRow } from "components/admin/resource-tables";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { createCategory } from "../taxonomy-actions";

export default async function CategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    include: {
      translations: {
        include: { _count: { select: { articles: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows: CategoryTableRow[] = categories.map((category) => {
    const br = category.translations.find((item) => item.locale === "PT_BR");
    const en = category.translations.find((item) => item.locale === "EN_US");

    return {
      id: category.id,
      br: br
        ? {
            name: br.name,
            slug: br.slug,
            articleCount: br._count.articles,
            publicUrl: br.slug ? `/br/blog/categories/${br.slug}` : null,
          }
        : null,
      en: en
        ? {
            name: en.name,
            slug: en.slug,
            articleCount: en._count.articles,
            publicUrl: en.slug ? `/en/blog/categories/${en.slug}` : null,
          }
        : null,
      articleCount: Math.max(br?._count.articles ?? 0, en?._count.articles ?? 0),
      updatedAt: category.updatedAt.toISOString(),
    };
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Taxonomia"
        title="Categorias"
        description="Organize os artigos em temas amplos e mantenha os nomes consistentes nos dois idiomas."
      />

      <AdminPanel>
        <form action={createCategory} className="p-5 sm:p-6">
          <div>
            <h2 className="font-bold text-site-heading">Nova categoria</h2>
            <p className="mt-1 text-xs leading-5 text-site-muted">Os slugs públicos serão criados automaticamente a partir dos nomes.</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
            <label className={adminLabelClass}>
              Nome em português
              <input name="br" required placeholder="Ex.: Arquitetura" className={adminInputClass} />
            </label>
            <label className={adminLabelClass}>
              Name in English
              <input name="en" required placeholder="E.g. Architecture" className={adminInputClass} />
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
            <h2 className="font-bold text-site-heading">Categorias cadastradas</h2>
            <p className="mt-1 text-xs text-site-muted">Ordene, consulte o uso e gerencie as categorias.</p>
          </div>
          <AdminBadge tone="accent">{rows.length}</AdminBadge>
        </div>
        <CategoriesTable rows={rows} />
      </AdminPanel>
    </div>
  );
}
