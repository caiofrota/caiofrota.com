import { NextResponse } from "next/server";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { publicMediaUrl } from "lib/storage";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export async function GET(request: Request) {
  await requireAdmin();

  const cursor = new URL(request.url).searchParams.get("cursor")?.trim() || undefined;

  if (cursor) {
    const cursorAsset = await prisma.mediaAsset.findUnique({ where: { id: cursor }, select: { id: true } });
    if (!cursorAsset) {
      return NextResponse.json({ assets: [], nextCursor: null, error: "Cursor inválido." }, { status: 400 });
    }
  }

  const page = await prisma.mediaAsset.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      key: true,
      provider: true,
      filename: true,
      altText: true,
      mimeType: true,
      size: true,
      width: true,
      height: true,
    },
  });

  const hasNextPage = page.length > PAGE_SIZE;
  const visiblePage = page.slice(0, PAGE_SIZE);
  const assets = visiblePage.flatMap((asset) => {
    const url = publicMediaUrl(asset);
    if (!url) return [];
    const { key: _key, provider: _provider, ...details } = asset;
    return [{ ...details, url }];
  });

  return NextResponse.json({
    assets,
    nextCursor: hasNextPage ? (visiblePage.at(-1)?.id ?? null) : null,
  });
}
