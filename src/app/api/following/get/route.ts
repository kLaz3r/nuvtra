import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { follows } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    // Get userId from URL parameters
    const { userId } = (await request.json()) as { userId: string };
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Query the database for the user's following
    const following = await db
      .select()
      .from(follows)
      .where(eq(follows.followerId, userId))
      .execute();

    if (following.length === 0) {
      return NextResponse.json(
        { error: "User has no following" },
        { status: 404 },
      );
    }

    // Return response with caching headers
    // Cache for 30 minutes on CDN and browser
    return new NextResponse(JSON.stringify(following), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
