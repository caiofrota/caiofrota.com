import { getPostData } from "lib/articles";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");
  return NextResponse.json(await getPostData(slug || "", lang || "en-US"));
}
