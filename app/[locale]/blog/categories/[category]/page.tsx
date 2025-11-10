import { getCategorizedPosts } from "lib/articles";
import { Categories } from "./categories";

export default async function BlogPage({ params }: { params: Promise<{ category: string }> }) {
  const articles = await getCategorizedPosts();
  return <Categories articles={articles[(await params).category?.toLowerCase()] ?? []} />;
}
