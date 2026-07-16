import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { publicMediaUrl, uploadMedia } from "lib/storage";

export const runtime = "nodejs";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function POST(request: Request) {
  await requireAdmin();
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size || !allowedImageTypes.has(file.type) || file.size > 8_000_000) {
    return NextResponse.json({ error: "Envie uma imagem JPG, PNG, WebP, GIF ou AVIF de até 8 MB." }, { status: 400 });
  }
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-") || "imagem";
  const key = `caiofrota/blog/${new Date().toISOString().slice(0, 7)}/${randomUUID()}-${safeName}`;
  try {
    const stored = await uploadMedia(file, key);
    const asset = await prisma.mediaAsset.create({
      data: {
        key: stored.key,
        provider: stored.provider,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        altText: file.name.replace(/\.[^.]+$/, ""),
      },
    });
    const url = publicMediaUrl(asset);
    if (!url) throw new Error("Não foi possível gerar a URL pública da imagem.");
    return NextResponse.json({ id: asset.id, url, altText: asset.altText, provider: stored.provider });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha no upload." }, { status: 500 });
  }
}
