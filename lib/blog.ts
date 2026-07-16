import "server-only";
import { prisma } from "./prisma";
import { routeLocale, type RouteLocale } from "./locale";
import { publicMediaUrl } from "./storage";

export type PublicArticle = {
  id: string;
  articleId: string;
  locale: RouteLocale;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml?: string;
  category?: { name: string; slug: string };
  tags: Array<{ name: string; slug: string }>;
  coverUrl?: string;
  ogUrl?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  readingTimeMinutes?: number;
};

type DatabaseLocale = "PT_BR" | "EN_US";
const databaseLocale = (locale: RouteLocale): DatabaseLocale => (locale === "br" ? "PT_BR" : "EN_US");

export async function listPublishedArticles(locale: string): Promise<PublicArticle[]> {
  const current = routeLocale(locale);
  const items = await prisma.articleTranslation.findMany({
    where: { locale: databaseLocale(current), status: "PUBLISHED" },
    include: { coverImage: true, ogImage: true, categories: true, tags: true },
    orderBy: { publishedAt: "desc" },
  });
  return items.map((item) => ({
    id: item.id,
    articleId: item.articleId,
    locale: current,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt ?? "",
    category: item.categories[0] ? { name: item.categories[0].name, slug: item.categories[0].slug } : undefined,
    tags: item.tags.map((tag) => ({ name: tag.name, slug: tag.slug })),
    coverUrl: publicMediaUrl(item.coverImage),
    ogUrl: publicMediaUrl(item.ogImage),
    publishedAt: item.publishedAt ?? undefined,
    updatedAt: item.updatedAt,
    readingTimeMinutes: item.readingTimeMinutes,
  }));
}

export async function getPublishedArticle(locale: string, slug: string): Promise<PublicArticle | null> {
  const current = routeLocale(locale);
  const item = await prisma.articleTranslation.findUnique({
    where: { locale_slug: { locale: databaseLocale(current), slug } },
    include: { coverImage: true, ogImage: true, categories: true, tags: true },
  });
  if (!item || item.status !== "PUBLISHED") return null;
  return {
    id: item.id,
    articleId: item.articleId,
    locale: current,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt ?? "",
    contentHtml: item.contentHtml,
    category: item.categories[0] ? { name: item.categories[0].name, slug: item.categories[0].slug } : undefined,
    tags: item.tags.map((tag) => ({ name: tag.name, slug: tag.slug })),
    coverUrl: publicMediaUrl(item.coverImage),
    ogUrl: publicMediaUrl(item.ogImage),
    publishedAt: item.publishedAt ?? undefined,
    updatedAt: item.updatedAt,
    readingTimeMinutes: item.readingTimeMinutes,
  };
}

export async function getAlternateSlug(articleId: string, locale: RouteLocale) {
  const item = await prisma.articleTranslation.findUnique({
    where: { articleId_locale: { articleId, locale: databaseLocale(locale) } },
    select: { slug: true },
  });
  return item?.slug ?? null;
}

export async function listPublishedCategories(locale: string) {
  const current = routeLocale(locale);
  const categories = await prisma.categoryTranslation.findMany({
    where: { locale: databaseLocale(current) },
    include: { articles: { where: { status: "PUBLISHED" } } },
    orderBy: { name: "asc" },
  });
  return categories
    .filter((category) => category.articles.length)
    .map((category) => ({ name: category.name, slug: category.slug, count: category.articles.length }));
}

export async function listArticlesByCategory(locale: string, categorySlug: string) {
  const all = await listPublishedArticles(locale);
  return all.filter((article) => article.category?.slug === categorySlug);
}
