import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createNotification } from "~/lib/notifications";
import { db } from "~/server/db";
import { comments, posts, users } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    const { postId, content, userId } = await request.json();

    if (!postId || !content || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get post author to send notification
    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, postId),
      with: {
        author: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const newComment = await db
      .insert(comments)
      .values({
        postId,
        content,
        authorId: userId,
      })
      .returning();

    // Create notification for post author
    if (post.author.id !== userId) {
      // Don't notify if user comments on their own post
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      });

      await createNotification({
        type: "COMMENT",
        userId: post.author.id,
        createdById: userId,
        message: `${user?.username} commented on your post`,
      });
    }

    return NextResponse.json({
      message: "Comment created successfully",
      comment: newComment[0],
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
