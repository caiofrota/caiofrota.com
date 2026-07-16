"use server";

import sanitizeHtml from "sanitize-html";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";

function cleanHtml(value: FormDataEntryValue | null) {
  return sanitizeHtml(String(value ?? ""), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "h1", "h2", "pre", "code"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "data-align"],
    },
  });
}

export async function createArticle() {
  const user = await requireAdmin();
  const article = await prisma.article.create({
    data: {
      authorId: user.id,
      translations: {
        create: [
          { locale: "PT_BR", title: "", slug: "" },
          { locale: "EN_US", title: "", slug: "" },
        ],
      },
    },
  });
  redirect(`/admin/posts/${article.id}`);
}

export async function saveArticle(articleId: string, form: FormData) {
  await requireAdmin();
  const categoryId = String(form.get("categoryId") ?? "");
  const tagIds = form.getAll("tagIds").map(String).filter(Boolean);
  const requestedCoverImageId = String(form.get("coverImageId") ?? "");
  const coverImage = requestedCoverImageId
    ? await prisma.mediaAsset.findUnique({ where: { id: requestedCoverImageId }, select: { id: true } })
    : null;
  const publish = form.get("intent") === "publish";

  for (const locale of ["PT_BR", "EN_US"] as const) {
    const suffix = locale === "PT_BR" ? "br" : "en";
    const title = String(form.get(`title_${suffix}`) ?? "").trim();
    const slug = String(form.get(`slug_${suffix}`) ?? "").trim();
    if (!title || !slug) throw new Error("Both language titles and slugs are required.");
    const contentHtml = cleanHtml(form.get(`content_${suffix}`));
    const excerpt = String(form.get(`excerpt_${suffix}`) ?? "").trim();
    const wordCount = contentHtml
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const categoryTranslation = categoryId
      ? await prisma.categoryTranslation.findUnique({ where: { categoryId_locale: { categoryId, locale } } })
      : null;
    const tagTranslations = tagIds.length
      ? await prisma.tagTranslation.findMany({ where: { tagId: { in: tagIds }, locale }, select: { id: true } })
      : [];

    await prisma.articleTranslation.update({
      where: { articleId_locale: { articleId, locale } },
      data: {
        title,
        slug,
        excerpt,
        contentHtml,
        coverImageId: coverImage?.id ?? null,
        seoTitle: String(form.get(`seoTitle_${suffix}`) ?? "") || null,
        seoDescription: String(form.get(`seoDescription_${suffix}`) ?? "") || null,
        readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 220)),
        ...(publish ? { status: "PUBLISHED", publishedAt: new Date(), hasUnpublishedChanges: false } : { status: "DRAFT" }),
        categories: { set: categoryTranslation ? [{ id: categoryTranslation.id }] : [] },
        tags: { set: tagTranslations },
      },
    });
  }
  revalidatePath("/br/blog");
  revalidatePath("/en/blog");
  revalidatePath("/sitemap.xml");
  redirect(`/admin/posts/${articleId}?saved=1`);
}

export async function deleteArticle(articleId: string, form: FormData) {
  void form;
  await requireAdmin();
  await prisma.article.deleteMany({ where: { id: articleId } });
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/br/blog");
  revalidatePath("/en/blog");
  revalidatePath("/sitemap.xml");
}
