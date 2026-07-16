import { HardDrive, ImageOff } from "lucide-react";
import { AdminBadge, AdminPageHeader, AdminPanel } from "components/admin/admin-ui";
import { MediaTable, type MediaTableRow } from "components/admin/resource-tables";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { isRemoteMediaStorageConfigured, LOCAL_MEDIA_PROVIDER, publicMediaUrl } from "lib/storage";

export default async function MediaPage() {
  await requireAdmin();
  const media = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  const remoteStorage = isRemoteMediaStorageConfigured();

  const rows: MediaTableRow[] = media.map((asset) => ({
    id: asset.id,
    filename: asset.filename,
    key: asset.key,
    altText: asset.altText,
    publicUrl: publicMediaUrl(asset) ?? null,
    provider: asset.provider,
    mimeType: asset.mimeType,
    size: asset.size,
    width: asset.width,
    height: asset.height,
    createdAt: asset.createdAt.toISOString(),
  }));
  const unavailableRemoteAssets = rows.filter((row) => row.provider !== LOCAL_MEDIA_PROVIDER && !row.publicUrl).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Biblioteca"
        title="Mídia"
        description="Consulte as imagens enviadas pelo editor, armazenadas localmente ou no bucket configurado."
        actions={
          <AdminBadge tone={remoteStorage ? "success" : "accent"}>{remoteStorage ? "S3/R2 configurado" : "Armazenamento local"}</AdminBadge>
        }
      />

      {!remoteStorage ? (
        <div className="flex gap-3 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-800 dark:text-cyan-200">
          <HardDrive className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            S3/R2 não configurado. Novos uploads serão salvos em <code>.data/uploads</code> e servidos pelo próprio site.
          </p>
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
