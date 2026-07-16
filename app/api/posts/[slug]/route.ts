import { getPublishedArticle } from "lib/blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const article = await getPublishedArticle(searchParams.get("lang") || "en", slug);
  if (!article) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json(article);
}
