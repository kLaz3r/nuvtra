/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
// don't ask

import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

export async function GET(request: NextRequest, context: any) {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, context.params["post-id"]),
      with: {
        author: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          with: {
            author: {
              columns: {
                username: true,
                avatar: true,
              },
            },
          },
        },
        likes: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
