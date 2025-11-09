"use server";
import fs from "fs";
import matter from "gray-matter";
import moment from "moment";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export async function getSortedPosts(): Promise<PostMeta[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts: PostMeta[] = await Promise.all(
    fileNames.map(async (fileName) => {
      const name = fileName.replace(/\.md$/, "");
      const language = name.match(/^(.*)\.([a-z]{2}(?:-[A-Z]{2})?)$/);
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);

      return {
        id: language?.[1] || name,
        lang: language?.[2] || null,
        title: matterResult.data.title,
        categorySlug: await slugify(matterResult.data.category),
        category: matterResult.data.category,
        preview: getPreview(matterResult.content),
        date: matterResult.data.date,
        featured: matterResult.data.featured || undefined,
      };
    }),
  );

  return allPosts.sort((a, b) => {
    const format = "DD-MM-YYYY";
    const dateA = moment(a.date, format);
    const dateB = moment(b.date, format);
    if (dateA.isBefore(dateB)) return 1;
    if (dateA.isAfter(dateB)) return -1;
    return 0;
  });
}

export async function getCategorizedPosts(): Promise<Record<string, PostMeta[]>> {
  const allPosts = await getSortedPosts();
  const categorizedPosts: Record<string, PostMeta[]> = {};

  await Promise.all(
    allPosts.map(async (post) => {
      const slug = await slugify(post.category);
      if (!categorizedPosts[slug]) {
        categorizedPosts[slug] = [];
      }
      categorizedPosts[slug].push(post);
    }),
  );

  return categorizedPosts;
}

export async function getPostData(id: string, lang?: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${id}${lang ? `.${lang}` : ""}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);
  const htmlContent = await remark().use(html).process(matterResult.content);

  return {
    id,
    lang: lang || null,
    title: matterResult.data.title,
    subtitle: matterResult.data.subtitle,
    categorySlug: await slugify(matterResult.data.category),
    category: matterResult.data.category,
    date: matterResult.data.date,
    html: htmlContent.toString(),
  };
}

export async function slugify(text: string): Promise<string> {
  return text
    .toString()
    .normalize("NFD") // split accented letters (e.g. é -> e + ́)
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase() // lowercase everything
    .trim() // remove spaces at start/end
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, ""); // remove leading/trailing dashes
}

function getPreview(text: string, length: number = 200): string {
  const cleanText = text
    // Remove markdown images ![alt](url)
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    // Remove links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove markdown formatting symbols (#, *, _, `, >, -, etc.)
    .replace(/[#*_`>~\-]/g, "")
    // Remove extra whitespace and newlines
    .replace(/\s+/g, " ")
    .trim();

  if (cleanText.length <= length) return cleanText;
  return cleanText.slice(0, length) + "...";
}

export type PostMeta = {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  categorySlug: string;
  category: string;
  lang: string | null;
  preview: string;
  featured?: string;
};

export type PostData = {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  categorySlug: string;
  category: string;
  lang: string | null;
  html: string;
};
