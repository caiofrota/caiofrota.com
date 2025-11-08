import { getCategorizedPosts } from "lib/articles";
import { Articles } from "./articles";

export default async function BlogPage() {
  const articles = await getCategorizedPosts();
  return <Articles articles={articles} />;
}
