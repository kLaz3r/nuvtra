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
    const { followerId, followingId } = (await req.json()) as Follow;

    // Validate input
    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if follow relationship already exists
    const existingFollow = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      );

    if (existingFollow.length > 0) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 },
      );
    }

    // Create new follow relationship
    const newFollow = await db
      .insert(follows)
      .values({
        followerId,
        followingId,
      })
      .returning();

    return NextResponse.json(
      { message: "Follow successful", follow: newFollow[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating follow:", error);
    return NextResponse.json(
      { error: "Failed to create follow relationship" },
      { status: 500 },
    );
  }
}
