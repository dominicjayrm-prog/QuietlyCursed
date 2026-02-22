import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/atlas";

/** GET /api/atlas — list published posts (public) */
export async function GET() {
  const posts = await getPublishedPosts();
  return NextResponse.json(posts);
}
