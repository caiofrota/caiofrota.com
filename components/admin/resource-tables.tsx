"use client";

import { Check, Copy, ExternalLink, FileImage, FileText, FolderTree, Pencil, Tag, Trash2, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteMediaAsset } from "app/admin/media/actions";
import { createArticle, deleteArticle } from "app/admin/posts/actions";
import { deleteCategory, deleteTag } from "app/admin/taxonomy-actions";
import { AdminBadge, AdminEmptyState } from "components/admin/admin-ui";
import { AdminDataTable, type AdminDataColumn } from "components/admin/admin-data-table";
import { ConfirmActionButton } from "components/admin/confirm-action-button";

type PublicationStatus = "DRAFT" | "PUBLISHED";

type PostTranslation = {
  complete: boolean;
  publicUrl: string | null;
};

export type PostTableRow = {
  id: string;
  title: string;
  secondaryTitle: string | null;
  coverUrl: string | null;
  status: PublicationStatus;
  br: PostTranslation | null;
  en: PostTranslation | null;
  updatedAt: string;
};

type TaxonomyTranslation = {
  name: string;
  slug: string;
  articleCount: number;
  publicUrl?: string | null;
};

export type CategoryTableRow = {
  id: string;
  br: TaxonomyTranslation | null;
  en: TaxonomyTranslation | null;
  articleCount: number;
  updatedAt: string;
};

export type TagTableRow = {
  id: string;
  br: TaxonomyTranslation | null;
  en: TaxonomyTranslation | null;
  articleCount: number;
  updatedAt: string;
};

export type MediaTableRow = {
  id: string;
  filename: string;
  key: string;
  altText: string | null;
  publicUrl: string | null;
  provider: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  usageCount: number;
  createdAt: string;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const postColumns: AdminDataColumn<PostTableRow>[] = [
  {
    id: "title",
    header: "Artigo",
    sortValue: (row) => row.title,
    cellClassName: "min-w-[17rem]",
    cell: (row) => <PostIdentity row={row} />,
  },
  {
    id: "status",
    header: "Status",
    sortValue: (row) => row.status,
    cellClassName: "min-w-[8rem]",
    cell: (row) => <PublicationStatusBadge status={row.status} />,
  },
  {
    id: "languages",
    header: "Idiomas",
    sortValue: (row) => Number(Boolean(row.br?.complete)) + Number(Boolean(row.en?.complete)),
    cellClassName: "min-w-[11rem]",
    cell: (row) => <LanguageCompleteness br={Boolean(row.br?.complete)} en={Boolean(row.en?.complete)} />,
  },
  {
    id: "updatedAt",
    header: "Atualizado",
    sortValue: (row) => row.updatedAt,
    cellClassName: "whitespace-nowrap",
    cell: (row) => <time className="text-xs font-medium text-site-muted">{formatDate(row.updatedAt)}</time>,
  },
  {
    id: "actions",
    header: "Ações",
    headerClassName: "text-right",
    cellClassName: "w-px whitespace-nowrap",
    cell: (row) => <PostActions row={row} />,
  },
];

const categoryColumns: AdminDataColumn<CategoryTableRow>[] = [
  {
    id: "br",
    header: "Português",
    sortValue: (row) => row.br?.name,
    cellClassName: "min-w-[15rem]",
    cell: (row) => <TaxonomyIdentity icon={FolderTree} translation={row.br} fallback="Categoria sem nome" />,
  },
  {
    id: "en",
    header: "English",
    sortValue: (row) => row.en?.name,
    cellClassName: "min-w-[12rem]",
    cell: (row) => <TaxonomyName translation={row.en} fallback="Missing translation" />,
  },
  {
    id: "usage",
    header: "Uso",
    sortValue: (row) => row.articleCount,
    cell: (row) => <AdminBadge tone={row.articleCount ? "accent" : "neutral"}>{formatArticleCount(row.articleCount)}</AdminBadge>,
  },
  {
    id: "updatedAt",
    header: "Atualizado",
    sortValue: (row) => row.updatedAt,
    cellClassName: "whitespace-nowrap",
    cell: (row) => <time className="text-xs font-medium text-site-muted">{formatDate(row.updatedAt)}</time>,
  },
  {
    id: "actions",
    header: "Ações",
    headerClassName: "text-right",
    cellClassName: "w-px whitespace-nowrap",
    cell: (row) => <CategoryActions row={row} />,
  },
];

const tagColumns: AdminDataColumn<TagTableRow>[] = [
  {
    id: "br",
    header: "Português",
    sortValue: (row) => row.br?.name,
    cellClassName: "min-w-[15rem]",
    cell: (row) => <TaxonomyIdentity icon={Tag} translation={row.br} fallback="Tag sem nome" />,
  },
  {
    id: "en",
    header: "English",
    sortValue: (row) => row.en?.name,
    cellClassName: "min-w-[12rem]",
    cell: (row) => <TaxonomyName translation={row.en} fallback="Missing translation" />,
  },
  {
    id: "usage",
    header: "Uso",
    sortValue: (row) => row.articleCount,
    cell: (row) => <AdminBadge tone={row.articleCount ? "accent" : "neutral"}>{formatArticleCount(row.articleCount)}</AdminBadge>,
  },
  {
    id: "updatedAt",
    header: "Atualizado",
    sortValue: (row) => row.updatedAt,
    cellClassName: "whitespace-nowrap",
    cell: (row) => <time className="text-xs font-medium text-site-muted">{formatDate(row.updatedAt)}</time>,
  },
  {
    id: "actions",
    header: "Ações",
    headerClassName: "text-right",
    cellClassName: "w-px whitespace-nowrap",
    cell: (row) => <TagActions row={row} />,
  },
];

const mediaColumns: AdminDataColumn<MediaTableRow>[] = [
  {
    id: "filename",
    header: "Arquivo",
    sortValue: (row) => row.filename,
    cellClassName: "min-w-[18rem]",
    cell: (row) => <MediaIdentity row={row} />,
  },
  {
    id: "mimeType",
    header: "Tipo",
    sortValue: (row) => row.mimeType,
    cell: (row) => (
      <div>
        <AdminBadge>{row.provider}</AdminBadge>
        <p className="mt-1.5 whitespace-nowrap text-xs text-site-muted">{row.mimeType}</p>
      </div>
    ),
  },
  {
    id: "dimensions",
    header: "Dimensões",
    sortValue: (row) => (row.width ?? 0) * (row.height ?? 0),
    cellClassName: "whitespace-nowrap text-xs text-site-muted",
    cell: (row) => formatDimensions(row),
  },
  {
    id: "size",
    header: "Tamanho",
    sortValue: (row) => row.size,
    cellClassName: "whitespace-nowrap text-xs font-medium text-site-muted",
    cell: (row) => formatFileSize(row.size),
  },
  {
    id: "usage",
    header: "Uso",
    sortValue: (row) => row.usageCount,
    cellClassName: "whitespace-nowrap",
    cell: (row) => (
      <AdminBadge tone={row.usageCount ? "warning" : "neutral"}>{row.usageCount ? formatMediaUsage(row.usageCount) : "Livre"}</AdminBadge>
    ),
  },
  {
    id: "createdAt",
    header: "Enviado em",
    sortValue: (row) => row.createdAt,
    cellClassName: "whitespace-nowrap",
    cell: (row) => <time className="text-xs font-medium text-site-muted">{formatDate(row.createdAt)}</time>,
  },
  {
    id: "actions",
    header: "Ações",
    headerClassName: "text-right",
    cellClassName: "w-px whitespace-nowrap",
    cell: (row) => <MediaActions row={row} />,
  },
];

export function PostsTable({ rows }: { rows: PostTableRow[] }) {
  return (
    <AdminDataTable
      rows={rows}
      columns={postColumns}
      getRowId={(row) => row.id}
      initialSort={{ columnId: "updatedAt", direction: "desc" }}
      itemLabel={rows.length === 1 ? "artigo" : "artigos"}
      renderMobileCard={(row) => (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <PostIdentity row={row} />
            <PostActions row={row} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MobileDetail label="Status">
              <PublicationStatusBadge status={row.status} />
            </MobileDetail>
            <MobileDetail label="Idiomas">
              <LanguageCompleteness br={Boolean(row.br?.complete)} en={Boolean(row.en?.complete)} />
            </MobileDetail>
          </div>
          <MobileMeta label="Atualizado" value={formatDate(row.updatedAt)} />
        </div>
      )}
      emptyState={
        <AdminEmptyState
          icon={FileText}
          title="Nenhum artigo ainda"
          description="Crie o primeiro conteúdo bilíngue e publique quando as duas versões estiverem prontas."
          action={
            <form action={createArticle}>
              <button className="button-primary">Criar primeiro artigo</button>
            </form>
          }
        />
      }
    />
  );
}

export function CategoriesTable({ rows }: { rows: CategoryTableRow[] }) {
  return (
    <AdminDataTable
      rows={rows}
      columns={categoryColumns}
      getRowId={(row) => row.id}
      initialSort={{ columnId: "br", direction: "asc" }}
      itemLabel={rows.length === 1 ? "categoria" : "categorias"}
      renderMobileCard={(row) => (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <TaxonomyIdentity icon={FolderTree} translation={row.br} fallback="Categoria sem nome" />
            <CategoryActions row={row} />
          </div>
          <MobileDetail label="English">
            <TaxonomyName translation={row.en} fallback="Missing translation" />
          </MobileDetail>
          <div className="flex items-center justify-between gap-3">
            <AdminBadge tone={row.articleCount ? "accent" : "neutral"}>{formatArticleCount(row.articleCount)}</AdminBadge>
            <MobileMeta label="Atualizado" value={formatDate(row.updatedAt)} inline />
          </div>
        </div>
      )}
      emptyState={
        <AdminEmptyState
          icon={FolderTree}
          title="Nenhuma categoria cadastrada"
          description="Use o formulário acima para criar o primeiro tema do blog em português e inglês."
        />
      }
    />
  );
}

export function TagsTable({ rows }: { rows: TagTableRow[] }) {
  return (
    <AdminDataTable
      rows={rows}
      columns={tagColumns}
      getRowId={(row) => row.id}
      initialSort={{ columnId: "br", direction: "asc" }}
      itemLabel={rows.length === 1 ? "tag" : "tags"}
      renderMobileCard={(row) => (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <TaxonomyIdentity icon={Tag} translation={row.br} fallback="Tag sem nome" />
            <TagActions row={row} />
          </div>
          <MobileDetail label="English">
            <TaxonomyName translation={row.en} fallback="Missing translation" />
          </MobileDetail>
          <div className="flex items-center justify-between gap-3">
            <AdminBadge tone={row.articleCount ? "accent" : "neutral"}>{formatArticleCount(row.articleCount)}</AdminBadge>
            <MobileMeta label="Atualizado" value={formatDate(row.updatedAt)} inline />
          </div>
        </div>
      )}
      emptyState={
        <AdminEmptyState
          icon={Tag}
          title="Nenhuma tag cadastrada"
          description="Use o formulário acima para criar o primeiro marcador nos dois idiomas."
        />
      }
    />
  );
}

export function MediaTable({ rows }: { rows: MediaTableRow[] }) {
  return (
    <AdminDataTable
      rows={rows}
      columns={mediaColumns}
      getRowId={(row) => row.id}
      initialSort={{ columnId: "createdAt", direction: "desc" }}
      itemLabel={rows.length === 1 ? "arquivo" : "arquivos"}
      renderMobileCard={(row) => (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <MediaIdentity row={row} />
            <MediaActions row={row} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MobileMeta label="Tipo" value={row.mimeType} />
            <MobileMeta label="Dimensões" value={formatDimensions(row)} />
            <MobileMeta label="Tamanho" value={formatFileSize(row.size)} />
            <MobileMeta label="Enviado em" value={formatDate(row.createdAt)} />
          </div>
          <MobileDetail label="Uso">
            <AdminBadge tone={row.usageCount ? "warning" : "neutral"}>
              {row.usageCount ? formatMediaUsage(row.usageCount) : "Livre para exclusão"}
            </AdminBadge>
          </MobileDetail>
        </div>
      )}
      emptyState={
        <AdminEmptyState
          icon={FileImage}
          title="Nenhuma mídia enviada"
          description="As imagens adicionadas pelo editor aparecerão aqui com tamanho, tipo e dimensões."
        />
      }
    />
  );
}

function PostIdentity({ row }: { row: PostTableRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ResourceThumbnail src={row.coverUrl} alt="" icon={FileText} />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-site-heading">{row.title}</p>
        {row.secondaryTitle ? <p className="mt-1 truncate text-xs text-site-muted">{row.secondaryTitle}</p> : null}
      </div>
    </div>
  );
}

function MediaIdentity({ row }: { row: MediaTableRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ResourceThumbnail src={row.publicUrl} alt={row.altText || row.filename} icon={FileImage} />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-site-heading" title={row.filename}>
          {row.filename}
        </p>
        <p className="mt-1 truncate font-mono text-[11px] text-site-muted" title={row.key}>
          {row.key}
        </p>
      </div>
    </div>
  );
}

function ResourceThumbnail({ src, alt, icon: Icon }: { src: string | null; alt: string; icon: LucideIcon }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-site-border bg-site-surface text-site-accent">
      {src ? <img src={src} alt={alt} loading="lazy" className="size-full object-cover" /> : <Icon className="size-5" aria-hidden="true" />}
    </span>
  );
}

function PublicationStatusBadge({ status }: { status: PublicationStatus }) {
  return <AdminBadge tone={status === "PUBLISHED" ? "success" : "warning"}>{status === "PUBLISHED" ? "Publicado" : "Rascunho"}</AdminBadge>;
}

function LanguageCompleteness({ br, en }: { br: boolean; en: boolean }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <AdminBadge tone={br ? "accent" : "neutral"}>PT-BR</AdminBadge>
        <AdminBadge tone={en ? "accent" : "neutral"}>EN-US</AdminBadge>
      </div>
      <p className="mt-1.5 text-[11px] text-site-muted">{Number(br) + Number(en)}/2 versões</p>
    </div>
  );
}

function TaxonomyIdentity({
  icon: Icon,
  translation,
  fallback,
}: {
  icon: LucideIcon;
  translation: TaxonomyTranslation | null;
  fallback: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-600/10 text-site-accent">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <TaxonomyName translation={translation} fallback={fallback} />
    </div>
  );
}

function TaxonomyName({ translation, fallback }: { translation: TaxonomyTranslation | null; fallback: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-bold text-site-heading">{translation?.name || fallback}</p>
      <p className="mt-1 truncate font-mono text-[11px] text-site-muted">/{translation?.slug || "sem-slug"}</p>
    </div>
  );
}

function PostActions({ row }: { row: PostTableRow }) {
  const publicUrl = row.br?.publicUrl ?? row.en?.publicUrl;

  return (
    <ActionGroup>
      <ActionLink href={`/admin/posts/${row.id}`} icon={Pencil} label={`Editar ${row.title}`} tone="edit" />
      {publicUrl ? <ActionLink href={publicUrl} icon={ExternalLink} label={`Ver ${row.title} publicado`} tone="view" external /> : null}
      <ConfirmActionButton
        action={deleteArticle.bind(null, row.id)}
        icon={Trash2}
        triggerLabel={`Excluir ${row.title}`}
        title="Excluir este artigo?"
        description={`“${row.title}” e suas duas traduções serão removidos permanentemente.`}
        confirmLabel="Excluir artigo"
        tone="danger"
      />
    </ActionGroup>
  );
}

function CategoryActions({ row }: { row: CategoryTableRow }) {
  const name = row.br?.name ?? row.en?.name ?? "esta categoria";
  const publicUrl = row.br?.publicUrl ?? row.en?.publicUrl;

  return (
    <ActionGroup>
      {publicUrl ? <ActionLink href={publicUrl} icon={ExternalLink} label={`Ver categoria ${name}`} tone="view" external /> : null}
      <ConfirmActionButton
        action={deleteCategory.bind(null, row.id)}
        icon={Trash2}
        triggerLabel={`Excluir categoria ${name}`}
        title="Excluir esta categoria?"
        description={`“${name}” será removida dos artigos relacionados. Os artigos não serão excluídos.`}
        confirmLabel="Excluir categoria"
        tone="danger"
      />
    </ActionGroup>
  );
}

function TagActions({ row }: { row: TagTableRow }) {
  const name = row.br?.name ?? row.en?.name ?? "esta tag";

  return (
    <ActionGroup>
      <ConfirmActionButton
        action={deleteTag.bind(null, row.id)}
        icon={Trash2}
        triggerLabel={`Excluir tag ${name}`}
        title="Excluir esta tag?"
        description={`“${name}” será removida dos artigos relacionados. Os artigos não serão excluídos.`}
        confirmLabel="Excluir tag"
        tone="danger"
      />
    </ActionGroup>
  );
}

function MediaActions({ row }: { row: MediaTableRow }) {
  return (
    <ActionGroup>
      {row.publicUrl ? (
        <>
          <ActionLink href={row.publicUrl} icon={ExternalLink} label={`Abrir ${row.filename}`} tone="view" external />
          <CopyUrlButton url={row.publicUrl} filename={row.filename} />
        </>
      ) : (
        <>
          <DisabledAction icon={ExternalLink} label="URL pública não configurada" />
          <DisabledAction icon={Copy} label="URL pública não configurada" />
        </>
      )}
      {row.usageCount ? (
        <DisabledAction icon={Trash2} label={`${row.filename} está em uso. Remova a imagem dos posts antes de excluí-la.`} />
      ) : (
        <ConfirmActionButton
          action={deleteMediaAsset.bind(null, row.id)}
          icon={Trash2}
          triggerLabel={`Excluir ${row.filename}`}
          title="Excluir esta imagem?"
          description={`“${row.filename}” será removida permanentemente da biblioteca e do ${row.provider === "local" ? "armazenamento local" : "bucket S3/R2"}.`}
          confirmLabel="Excluir imagem"
          tone="danger"
        />
      )}
    </ActionGroup>
  );
}

function ActionGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex shrink-0 items-center justify-end gap-0.5">{children}</div>;
}

function ActionLink({
  href,
  icon: Icon,
  label,
  tone,
  external = false,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  tone: "edit" | "view";
  external?: boolean;
}) {
  const toneClass =
    tone === "edit"
      ? "text-cyan-700 hover:bg-cyan-500/10 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
      : "text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200";

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`cf-ring grid size-9 place-items-center rounded-lg transition ${toneClass}`}
      aria-label={label}
      title={label}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Link>
  );
}

function CopyUrlButton({ url, filename }: { url: string; filename: string }) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    await navigator.clipboard.writeText(new URL(url, window.location.origin).href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const label = copied ? `URL de ${filename} copiada` : `Copiar URL de ${filename}`;

  return (
    <button
      type="button"
      onClick={copyUrl}
      className="cf-ring grid size-9 cursor-pointer place-items-center rounded-lg text-violet-700 transition hover:bg-violet-500/10 hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200"
      aria-label={label}
      title={label}
    >
      {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
    </button>
  );
}

function DisabledAction({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      disabled
      className="grid size-9 cursor-not-allowed place-items-center rounded-lg text-site-muted opacity-35"
      aria-label={label}
      title={label}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}

function MobileDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-site-border bg-site-surface-strong p-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-site-muted">{label}</p>
      {children}
    </div>
  );
}

function MobileMeta({ label, value, inline = false }: { label: string; value: string; inline?: boolean }) {
  return (
    <div className={inline ? "text-right" : "min-w-0"}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-site-muted">{label}</p>
      <p className="mt-1 truncate text-xs font-semibold text-site-heading">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function formatArticleCount(value: number) {
  return value === 1 ? "1 artigo" : `${value} artigos`;
}

function formatDimensions(row: Pick<MediaTableRow, "width" | "height">) {
  return row.width && row.height ? `${row.width} × ${row.height}px` : "Não informadas";
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatMediaUsage(value: number) {
  return value === 1 ? "1 referência" : `${value} referências`;
}
