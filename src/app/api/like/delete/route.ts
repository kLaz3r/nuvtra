import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
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

    // Check if like exists
    const existingLike = await db.query.likes.findFirst({
      where: (likes, { and, eq }) =>
        and(eq(likes.userId, userId), eq(likes.postId, postId)),
    });

    if (!existingLike) {
      return NextResponse.json(
        { error: "Like does not exist" },
        { status: 404 },
      );
    }

    // Delete the like
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete like:", error);
    return new Response(JSON.stringify({ error: "Failed to delete like" }), {
      status: 500,
    });
  }
}
