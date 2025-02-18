import { NextResponse } from "next/server";
import { createNotification } from "~/lib/notifications";
import { db } from "~/server/db";
import { likes } from "~/server/db/schema";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { userId: string; postId: string };
    const { userId, postId } = body;

    // Validate required fields
    if (!userId || !postId) {
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

    // Check if like already exists
    const existingLike = await db.query.likes.findFirst({
      where: (likes, { and, eq }) =>
        and(eq(likes.userId, userId), eq(likes.postId, postId)),
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "Like already exists" },
        { status: 400 },
      );
    }

    // Create new like
    const newLike = await db.insert(likes).values({
      userId,
      postId,
    });

    // Create notification for post author
    if (post.author.id !== userId) {
      // Don't notify if user likes their own post
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      });

      await createNotification({
        type: "LIKE",
        userId: post.author.id,
        createdById: userId,
        message: `${user?.username} a apreciat postarea ta`,
        postId: postId,
      });
    }

    return NextResponse.json({ success: true, like: newLike });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to create like" }), {
      status: 500,
    });
  }
}
