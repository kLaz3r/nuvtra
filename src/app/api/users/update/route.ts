import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

type UserData = {
  id: string;
  username: string;
  email: string;
  bio?: string | null;
  avatar?: string | null;
  location?: string | null;
};

export async function POST(request: Request) {
  try {
    const userData = (await request.json()) as UserData;

    // Validate required fields
    if (!userData.username || !userData.email || !userData.id) {
      return NextResponse.json(
        { error: "Username, email and id are required" },
        { status: 400 },
      );
    }

    // Update existing user
    const updatedUser = await db
      .update(users)
      .set({
        username: userData.username,
        email: userData.email,
        bio: userData.bio ?? null,
        avatar: userData.avatar ?? null,
        location: userData.location ?? null,
      })
      .where(eq(users.id, userData.id))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser[0],
    });
  } catch (error: unknown) {
    // Check for unique constraint violations
    if ((error as { code?: string }).code === "23505") {
      // PostgreSQL unique violation code
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 },
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
