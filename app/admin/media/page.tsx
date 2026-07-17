import { AlertTriangle, CheckCircle2, HardDrive, ImageOff } from "lucide-react";
import { AdminBadge, AdminPageHeader, AdminPanel } from "components/admin/admin-ui";
import { MediaTable, type MediaTableRow } from "components/admin/resource-tables";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { getRemoteMediaStorageStatus, LOCAL_MEDIA_PROVIDER, publicMediaUrl } from "lib/storage";

type MediaPageProps = {
  searchParams?: Promise<{
    mediaDeleted?: string;
    mediaError?: "not-found" | "in-use" | "storage" | "database";
  }>;
};

export default async function MediaPage({ searchParams }: MediaPageProps) {
  await requireAdmin();
  const [media, articleContent, query] = await Promise.all([
    prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { coverFor: true, ogFor: true } } },
    }),
    prisma.articleTranslation.findMany({ select: { contentHtml: true, draftContentHtml: true } }),
    searchParams,
  ]);
  const storageStatus = getRemoteMediaStorageStatus();

  const rows: MediaTableRow[] = media.map((asset) => {
    const publicUrl = publicMediaUrl(asset) ?? null;
    const referenceTokens = [`/api/media/${encodeURIComponent(asset.id)}`, asset.key, publicUrl].filter((value): value is string =>
      Boolean(value),
    );
    const inlineUsageCount = articleContent.filter((article) => {
      const html = `${article.contentHtml}\n${article.draftContentHtml ?? ""}`;
      return referenceTokens.some((token) => html.includes(token));
    }).length;

    return {
      id: asset.id,
      filename: asset.filename,
      key: asset.key,
      altText: asset.altText,
      publicUrl,
      provider: asset.provider,
      mimeType: asset.mimeType,
      size: asset.size,
      width: asset.width,
      height: asset.height,
      usageCount: asset._count.coverFor + asset._count.ogFor + inlineUsageCount,
      createdAt: asset.createdAt.toISOString(),
    };
  });
  const unavailableRemoteAssets = rows.filter((row) => row.provider !== LOCAL_MEDIA_PROVIDER && !row.publicUrl).length;
  const mediaError = query?.mediaError;
  const mediaErrorMessage = mediaError
    ? {
        "not-found": "A imagem não foi encontrada. A biblioteca pode ter sido atualizada em outra aba.",
        "in-use": "A imagem ainda está sendo usada em um post. Remova-a do conteúdo e da capa antes de excluí-la.",
        storage: "Não foi possível remover o arquivo do armazenamento. Confira a configuração e tente novamente.",
        database: "O arquivo foi removido do armazenamento, mas não foi possível excluir seu registro da biblioteca.",
      }[mediaError]
    : null;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Biblioteca"
        title="Mídia"
        description="Consulte as imagens enviadas pelo editor, armazenadas localmente ou no bucket configurado."
        actions={
          <AdminBadge tone={storageStatus.state === "ready" ? "success" : storageStatus.state === "incomplete" ? "warning" : "accent"}>
            {storageStatus.state === "ready"
              ? "S3/R2 configurado"
              : storageStatus.state === "incomplete"
                ? "S3/R2 incompleto"
                : "Armazenamento local"}
          </AdminBadge>
        }
      />

      {query?.mediaDeleted ? (
        <div className="flex gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>A imagem foi removida da biblioteca e do armazenamento.</p>
        </div>
      ) : null}

      {mediaErrorMessage ? (
        <div className="flex gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{mediaErrorMessage}</p>
        </div>
      ) : null}

      {storageStatus.state === "local" ? (
        <div className="flex gap-3 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-800 dark:text-cyan-200">
          <HardDrive className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            S3/R2 não configurado. Novos uploads serão salvos em <code>.data/uploads</code> e servidos pelo próprio site.
          </p>
        </div>
      ) : null}

      {storageStatus.state === "incomplete" ? (
        <div className="flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <p>
              A configuração S3/R2 está incompleta. Para evitar arquivos remotos sem URL pública, novos uploads continuarão em{" "}
              <code>.data/uploads</code> até a correção.
            </p>
            {storageStatus.missingVariables.length ? (
              <p>
                Variáveis ausentes: <code>{storageStatus.missingVariables.join(", ")}</code>.
              </p>
            ) : null}
            {storageStatus.invalidVariables.length ? (
              <p>
                Variáveis inválidas: <code>{storageStatus.invalidVariables.join(", ")}</code>.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {unavailableRemoteAssets ? (
        <div className="flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          <ImageOff className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            {unavailableRemoteAssets} {unavailableRemoteAssets === 1 ? "arquivo remoto está" : "arquivos remotos estão"} sem URL pública
            neste ambiente.
          </p>
        </div>
      ) : null}

      <AdminPanel className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-site-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-bold text-site-heading">Arquivos enviados</h2>
            <p className="mt-1 text-xs text-site-muted">Ordene por nome, tipo, dimensões, tamanho ou data.</p>
          </div>
          <AdminBadge tone="accent">{rows.length}</AdminBadge>
        </div>
        <MediaTable rows={rows} />
      </AdminPanel>
    </div>
  );
}
