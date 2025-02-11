import { like, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("searchQuery") ?? "";

    // Return an empty array if no search query is provided
    if (!searchQuery) {
      return NextResponse.json([]);
    }

    const results = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        bio: users.bio,
        avatar: users.avatar,
        createdAt: users.createdAt,
        location: users.location,
      })
      .from(users)
      .where(
        or(
          like(users.username, `%${searchQuery}%`),
          like(users.bio, `%${searchQuery}%`),
        ),
      )
      .orderBy(users.username)
      .limit(20);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching user search results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
