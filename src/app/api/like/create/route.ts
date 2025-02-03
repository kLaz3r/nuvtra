import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { likes } from "~/server/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { userId: string; postId: string };
    const { userId, postId } = body;

    // Validate required fields 
    if (!userId || !postId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
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

    return NextResponse.json({ success: true, like: newLike });
  } catch (error) {
    console.error("Error creating like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
