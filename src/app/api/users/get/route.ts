import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    // Get userId from URL parameters
    const { userId } = await request.json() as { userId: string };
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Query the database for the user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
