import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { createNotification } from "~/lib/notifications";
import { db } from "~/server/db";
import { follows, users } from "~/server/db/schema";

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

    // Create notification for the user being followed
    const follower = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, followerId),
    });

    await createNotification({
      type: "FOLLOW",
      userId: followingId,
      createdById: followerId,
      message: `${follower?.username} a început să te urmărească`,
    });

    return NextResponse.json(
      { message: "Follow successful", follow: newFollow[0] },
      { status: 201 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to create follow relationship" }),
      {
        status: 500,
      },
    );
  }
}
