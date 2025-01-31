import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

export async function GET() {
  try {
    const allPosts = await db.query.posts.findMany({
      with: {
        author: true,
        comments: true,
        likes: true,
      },
      orderBy: desc(posts.timestamp),
    });

    return NextResponse.json(allPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
