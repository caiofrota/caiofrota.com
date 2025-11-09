import { getCategorizedPosts } from "lib/articles";
import { Categories } from "./categories";

export default async function BlogPage() {
  const articles = await getCategorizedPosts();
  return (
    <Categories
      categories={Object.keys(articles ?? {}).map((category) => ({
        slug: category,
        name: `${articles[category]?.[0]?.category} (${articles[category].length})`,
        lang: articles[category]?.[0]?.lang ?? "",
      }))}
    />
  );
}
