import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { follows } from "~/server/db/schema";

type Follow = {
  followerId: string;
  followingId: string;
};

export async function POST(req: Request) {
  try {
    const {
      followerId,
      followingId,
    }: { followerId: string; followingId: string } =
      (await req.json()) as Follow;

    // Validate input
    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Delete the follow relationship
    const deletedFollow = await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      )
      .returning()
      .execute();

    if (deletedFollow.length === 0) {
      return NextResponse.json(
        { error: "Follow relationship not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Unfollow successful", follow: deletedFollow[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting follow:", error);
    return NextResponse.json(
      { error: "Failed to delete follow relationship" },
      { status: 500 },
    );
  }
}
