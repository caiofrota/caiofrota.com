import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { LOCAL_MEDIA_PROVIDER, localMediaFilePath, publicMediaUrl } from "lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) {
    return NextResponse.json({ error: "Mídia não encontrada." }, { status: 404 });
  }

  if (asset.provider !== LOCAL_MEDIA_PROVIDER) {
    const remoteUrl = publicMediaUrl(asset);
    return remoteUrl
      ? NextResponse.redirect(remoteUrl, 307)
      : NextResponse.json({ error: "Mídia remota indisponível neste ambiente." }, { status: 404 });
  }

  try {
    const etag = `"${asset.id}-${asset.updatedAt.getTime()}-${asset.size}"`;
    if (request.headers.get("if-none-match") === etag) {
      return new Response(null, { status: 304, headers: mediaHeaders(asset, etag) });
    }

    const contents = await readFile(localMediaFilePath(asset.key));
    return new Response(contents, { status: 200, headers: mediaHeaders(asset, etag) });
  } catch (error) {
    if (isMissingFileError(error)) {
      return NextResponse.json({ error: "Arquivo local não encontrado." }, { status: 404 });
    }
    throw error;
  }
}

function mediaHeaders(asset: { mimeType: string; size: number; filename: string }, etag: string) {
  return {
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(asset.filename)}`,
    "Content-Length": String(asset.size),
    "Content-Type": asset.mimeType,
    ETag: etag,
    "X-Content-Type-Options": "nosniff",
  };
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
