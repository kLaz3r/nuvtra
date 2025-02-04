import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { comments, posts } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { content: string; postId: string; userId: string };
    const { content, postId, userId } = body;

    // Validate request body
    if (!content || !postId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if post exists
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create the comment
    const [newComment] = await db
      .insert(comments)
      .values({
        content,
        postId,
        authorId: userId,
      })
      .returning();

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
