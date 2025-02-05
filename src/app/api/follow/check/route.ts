import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { follows } from "~/server/db/schema";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const followerId = searchParams.get("followerId");
    const followingId = searchParams.get("followingId");

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const existingFollow = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      )
      .execute();

    return NextResponse.json(
      { isFollowing: existingFollow.length > 0 },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 },
    );
  }
}
