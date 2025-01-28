import { NextResponse } from "next/server";
import { type FormData as UserData } from "~/app/sign-up/page";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    const userData = (await request.json()) as UserData;

    // Validate required fields
    if (!userData.username || !userData.email) {
      return NextResponse.json(
        { error: "Username and email are required" },
        { status: 400 },
      );
    }

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        id: userData.id,
        avatar: userData.avatar ?? null,
        username: userData.username,
        email: userData.email,
        bio: userData.bio ?? null,
        location: userData.location ?? null,
      })
      .returning();

    return NextResponse.json({
      message: "User created successfully",
      user: newUser[0],
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

    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
