import type { MetadataRoute } from "next";
import { listPublishedArticles, listPublishedCategories } from "lib/blog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.caiofrota.com";
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/en`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${base}/br`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://caiofrota.com/en/resume",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://caiofrota.com/br/resume",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://caiofrota.com/en/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://caiofrota.com/br/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
  const dynamicPages = (await Promise.all(["br", "en"].map(async (locale) => {
    const [articles, categories] = await Promise.all([listPublishedArticles(locale), listPublishedCategories(locale)]);
    return [
      ...articles.map((article) => ({ url: `${base}/${locale}/blog/${article.slug}`, lastModified: article.updatedAt ?? article.publishedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
      ...categories.map((category) => ({ url: `${base}/${locale}/blog/categories/${category.slug}`, changeFrequency: "weekly" as const, priority: 0.4 })),
    ];
  }))).flat();
  return [...staticPages, ...dynamicPages];
}
