import { NextResponse } from "next/server";
import { createNotification } from "~/lib/notifications";
import { db } from "~/server/db";
import { comments } from "~/server/db/schema";

type CreateCommentRequest = {
  postId: string;
  content: string;
  userId: string;
};

export async function POST(request: Request) {
  try {
    const { postId, content, userId } =
      (await request.json()) as CreateCommentRequest;

    if (!postId || !content || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

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

    if (post.author.id !== userId) {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      });

      if (user) {
        await createNotification({
          type: "COMMENT",
          userId: post.author.id,
          createdById: userId,
          message: `${user.username} a comentat la postarea ta`,
          postId: postId,
        });
      }
    }

    return NextResponse.json({
      message: "Comment created successfully",
      comment: newComment[0],
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to create comment" }), {
      status: 500,
    });
  }
}
