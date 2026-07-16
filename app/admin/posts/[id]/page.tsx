import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileText, Globe2, Info, Save, Search, Send, Settings2, Tags } from "lucide-react";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { publicMediaUrl } from "lib/storage";
import { AdminBadge, AdminPageHeader, AdminPanel, adminInputClass, adminLabelClass } from "components/admin/admin-ui";
import { AutomaticSlugFields } from "components/admin/automatic-slug-fields";
import { CoverImageField } from "components/admin/cover-image-field";
import { RichTextEditor } from "components/admin/rich-text-editor";
import { saveArticle } from "../actions";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const [article, categories, tags] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: {
        translations: { include: { categories: true, tags: true, coverImage: true } },
      },
    }),
    prisma.category.findMany({ include: { translations: true }, orderBy: { createdAt: "desc" } }),
    prisma.tag.findMany({ include: { translations: true }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!article) notFound();
  const br = article.translations.find((item) => item.locale === "PT_BR");
  const en = article.translations.find((item) => item.locale === "EN_US");
  if (!br || !en) notFound();

  const selectedCategory = br.categories[0]?.categoryId ?? "";
  const selectedTags = new Set(br.tags.map((tag) => tag.tagId));
  const selectedCover = br.coverImage ?? en.coverImage;
  const articleTitle = br.title || en.title || "Novo artigo";
  const isArticlePublished = br.status === "PUBLISHED" && en.status === "PUBLISHED";
  const lastUpdate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(article.updatedAt);

  return (
    <>
      <AdminPageHeader
        eyebrow="Editor bilíngue"
        title={articleTitle}
        description={`Edite as duas versões do artigo no mesmo fluxo. Última atualização em ${lastUpdate}.`}
        actions={
          <Link href="/admin/posts" className="button-secondary px-4 py-2.5">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar aos posts
          </Link>
        }
      />

      <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Status do artigo">
        <span className="text-xs font-semibold text-site-muted">Status do artigo</span>
        <AdminBadge tone={isArticlePublished ? "success" : "warning"}>{isArticlePublished ? "Publicado" : "Rascunho"}</AdminBadge>
      </div>

      {saved ? (
        <div
          role="status"
          className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          Alterações salvas com sucesso.
        </div>
      ) : null}

      <form action={saveArticle.bind(null, article.id)} className="mt-6 space-y-6">
        <AdminPanel className="overflow-hidden">
          <div className="flex items-start gap-3 border-b border-site-border px-5 py-4 sm:px-6">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-600/10 text-site-accent">
              <Settings2 className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-bold text-site-heading">Organização e imagem</h2>
              <p className="mt-0.5 text-xs leading-5 text-site-muted">
                Estes dados são compartilhados pelas versões em português e inglês.
              </p>
            </div>
          </div>

          <div className="grid items-start gap-5 p-5 sm:p-6 lg:grid-cols-2">
            <label className={adminLabelClass}>
              Categoria
              <select name="categoryId" defaultValue={selectedCategory} className={adminInputClass}>
                <option value="">Sem categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.translations.find((item) => item.locale === "PT_BR")?.name ?? "—"} /{" "}
                    {category.translations.find((item) => item.locale === "EN_US")?.name ?? "—"}
                  </option>
                ))}
              </select>
              <span className="mt-2 block text-xs font-normal leading-5 text-site-muted">
                A categoria será aplicada à tradução correspondente em cada idioma.
              </span>
            </label>

            <fieldset className="min-w-0">
              <legend className="sr-only">Tags</legend>
              <div className="flex flex-wrap items-center gap-2">
                <Tags className="size-4 text-site-accent" aria-hidden="true" />
                <p className="text-sm font-semibold text-site-heading">Tags</p>
                <span className="text-xs text-site-muted">Selecione quantas forem necessárias</span>
              </div>
              {tags.length ? (
                <div className="mt-3 flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-xl border border-site-border bg-site-surface p-3">
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="cf-ring inline-flex cursor-pointer items-center gap-2 rounded-full border border-site-border bg-site-surface-strong px-3 py-2 text-xs font-medium text-site-foreground transition hover:border-site-accent/40 hover:bg-site-surface-hover has-checked:border-site-accent/50 has-checked:bg-cyan-600/10 has-checked:text-site-heading"
                    >
                      <input
                        type="checkbox"
                        name="tagIds"
                        value={tag.id}
                        defaultChecked={selectedTags.has(tag.id)}
                        className="size-3.5 accent-cyan-700 dark:accent-cyan-400"
                      />
                      <span>
                        {tag.translations.find((item) => item.locale === "PT_BR")?.name ?? "—"}
                        <span className="mx-1 text-site-muted">/</span>
                        {tag.translations.find((item) => item.locale === "EN_US")?.name ?? "—"}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-xl border border-dashed border-site-border px-4 py-3 text-xs text-site-muted">
                  Nenhuma tag cadastrada. Você pode criá-las na área de taxonomia.
                </p>
              )}
            </fieldset>
          </div>

          <div className="border-t border-site-border px-5 py-5 sm:px-6 sm:py-6">
            <CoverImageField
              key={article.id}
              initialAsset={
                selectedCover
                  ? {
                      id: selectedCover.id,
                      filename: selectedCover.filename,
                      altText: selectedCover.altText,
                      url: publicMediaUrl(selectedCover) ?? null,
                      mimeType: selectedCover.mimeType,
                      size: selectedCover.size,
                      width: selectedCover.width,
                      height: selectedCover.height,
                    }
                  : null
              }
            />
          </div>
        </AdminPanel>

        <div className="grid items-start gap-6 2xl:grid-cols-2">
          <TranslationFields lang="Português (Brasil)" locale="PT-BR" suffix="br" item={br} />
          <TranslationFields lang="English (US)" locale="EN-US" suffix="en" item={en} />
        </div>

        <div className="sticky bottom-3 z-20 flex flex-col gap-4 rounded-2xl border border-site-border bg-site-surface p-4 shadow-[0_16px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-xs leading-5 text-site-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-site-accent" aria-hidden="true" />
            <span>Salvar como rascunho mantém o artigo fora do ar. Publicar disponibiliza PT e EN juntas.</span>
          </div>
          <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row">
            <button name="intent" value="draft" className="button-secondary px-4 py-2.5">
              <Save className="size-4" aria-hidden="true" />
              Salvar rascunho
            </button>
            <button name="intent" value="publish" className="button-primary px-4 py-2.5">
              <Send className="size-4" aria-hidden="true" />
              Publicar
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

function TranslationFields({
  lang,
  locale,
  suffix,
  item,
}: {
  lang: string;
  locale: "PT-BR" | "EN-US";
  suffix: "br" | "en";
  item: {
    title: string;
    slug: string;
    excerpt: string | null;
    contentHtml: string;
    seoTitle: string | null;
    seoDescription: string | null;
  };
}) {
  return (
    <AdminPanel className="overflow-hidden">
      <div className="flex items-center gap-4 border-b border-site-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-cyan-600/10 text-site-accent">
            <Globe2 className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-site-accent">{locale}</p>
            <h2 className="text-base font-bold text-site-heading">{lang}</h2>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <AutomaticSlugFields
          suffix={suffix}
          initialTitle={item.title}
          initialSlug={item.slug}
          titlePlaceholder={suffix === "br" ? "Título do artigo" : "Article title"}
          slugPlaceholder={suffix === "br" ? "meu-artigo" : "my-article"}
        />

        <label className={adminLabelClass}>
          Resumo
          <textarea
            name={`excerpt_${suffix}`}
            defaultValue={item.excerpt ?? ""}
            rows={3}
            className={`${adminInputClass} resize-y leading-6`}
            placeholder={suffix === "br" ? "Uma introdução curta para o card do blog." : "A short introduction for the blog card."}
          />
          <span className="mt-2 block text-xs font-normal leading-5 text-site-muted">
            Aparece na listagem do blog e ajuda o leitor a entender o conteúdo antes de abrir.
          </span>
        </label>

        <div>
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <p className={adminLabelClass}>Conteúdo</p>
              <p className="mt-1 text-xs leading-5 text-site-muted">Escreva e formate a versão completa neste idioma.</p>
            </div>
            <FileText className="size-4 shrink-0 text-site-muted" aria-hidden="true" />
          </div>
          <RichTextEditor name={`content_${suffix}`} initialHtml={item.contentHtml} label={`Conteúdo do artigo em ${lang}`} />
        </div>

        <details className="group rounded-xl border border-site-border bg-site-surface-strong">
          <summary className="cf-ring flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-site-heading marker:hidden">
            <span className="flex items-center gap-2">
              <Search className="size-4 text-site-accent" aria-hidden="true" />
              SEO e compartilhamento
            </span>
            <span className="text-xs font-normal text-site-muted group-open:hidden">Opcional</span>
          </summary>
          <div className="space-y-4 border-t border-site-border p-4">
            <label className={adminLabelClass}>
              Título SEO
              <input
                name={`seoTitle_${suffix}`}
                defaultValue={item.seoTitle ?? ""}
                className={adminInputClass}
                placeholder={suffix === "br" ? "Título exibido nos buscadores" : "Title shown in search results"}
              />
              <span className="mt-2 block text-xs font-normal text-site-muted">Recomendação: até 60 caracteres.</span>
            </label>
            <label className={adminLabelClass}>
              Descrição SEO
              <textarea
                name={`seoDescription_${suffix}`}
                defaultValue={item.seoDescription ?? ""}
                rows={3}
                className={`${adminInputClass} resize-y leading-6`}
                placeholder={suffix === "br" ? "Descrição para buscadores e redes sociais" : "Description for search and social sharing"}
              />
              <span className="mt-2 block text-xs font-normal text-site-muted">Recomendação: entre 140 e 160 caracteres.</span>
            </label>
          </div>
        </details>
      </div>
    </AdminPanel>
  );
}
