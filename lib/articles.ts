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
  const allPosts: PostMeta[] = fileNames.map((fileName) => {
    const name = fileName.replace(/\.md$/, "");
    const language = name.match(/^(.*)\.([a-z]{2}(?:-[A-Z]{2})?)$/);
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    return {
      id: language?.[1] || name,
      lang: language?.[2] || null,
      title: matterResult.data.title,
      category: matterResult.data.category,
      date: matterResult.data.date,
    };
  });

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

  allPosts.forEach((post) => {
    if (!categorizedPosts[post.category]) {
      categorizedPosts[post.category] = [];
    }
    categorizedPosts[post.category].push(post);
  });

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
    category: matterResult.data.category,
    date: moment(matterResult.data.date, "DD-MM-YYYY").format("MMMM D, YYYY"),
    html: htmlContent.toString(),
  };
}

export type PostMeta = {
  id: string;
  title: string;
  date: string;
  category: string;
  lang: string | null;
};

export type PostData = {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  category: string;
  lang: string | null;
  html: string;
};
