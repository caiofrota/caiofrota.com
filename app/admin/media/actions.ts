"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";
import { publicMediaUrl, removeStoredMedia } from "lib/storage";

export async function deleteMediaAsset(mediaId: string, form: FormData) {
  void form;
  await requireAdmin();

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: mediaId },
    select: {
      id: true,
      key: true,
      provider: true,
      _count: { select: { coverFor: true, ogFor: true } },
    },
  });

  if (!asset) redirect("/admin/media?mediaError=not-found");

  const referenceTokens = [`/api/media/${encodeURIComponent(asset.id)}`, asset.key, publicMediaUrl(asset)].filter(
    (value): value is string => Boolean(value),
  );
  const inlineReference = await prisma.articleTranslation.findFirst({
    where: {
      OR: referenceTokens.flatMap((token) => [{ contentHtml: { contains: token } }, { draftContentHtml: { contains: token } }]),
    },
    select: { id: true },
  });

  if (asset._count.coverFor || asset._count.ogFor || inlineReference) {
    redirect("/admin/media?mediaError=in-use");
  }

  try {
    await removeStoredMedia(asset);
  } catch {
    redirect("/admin/media?mediaError=storage");
  }

  try {
    await prisma.mediaAsset.delete({ where: { id: asset.id } });
  } catch {
    redirect("/admin/media?mediaError=database");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/media");
  redirect("/admin/media?mediaDeleted=1");
}
