import { NextResponse } from "next/server";
import type { FormData } from "~/app/feed/page";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    const postData = (await request.json()) as FormData;

    // Validate required fields
    if (!postData.bodyText) {
      return NextResponse.json(
        { error: "Body text is required" },
        { status: 400 },
      );
    }

    // Create new post
    const newPost = await db
      .insert(posts)
      .values({
        authorId: postData.authorId,
        content: postData.bodyText,
        imageUrl: postData.image ?? null,
      })
      .returning();

    return NextResponse.json({
      message: "Post created successfully",
      post: newPost[0],
    });
  } catch (error: unknown) {
    // Check for unique constraint violations
    if ((error as { code?: string }).code === "23505") {
      // PostgreSQL unique violation code
      return NextResponse.json(
        { error: "Post already exists" },
        { status: 409 },
      );
    }

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
