import { desc, like, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { posts, users } from "~/server/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("searchQuery") ?? "";

    // Return an empty array if no search query is provided
    if (!searchQuery) {
      return NextResponse.json([]);
    }

    const results = await db.query.posts.findMany({
      where: or(
        like(posts.content, `%${searchQuery}%`),
        sql`EXISTS (
          SELECT 1 FROM ${users} 
            WHERE ${users}.id = ${posts.authorId}
              AND ${users}.username ILIKE ${`%${searchQuery}%`}
        )`,
      ),
      with: {
        author: {
          columns: {
            id: true,
            username: true,
            email: true,
            bio: true,
            avatar: true,
            createdAt: true,
            location: true,
          },
        },
        comments: {
          with: {
            author: {
              columns: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        likes: true,
      },
      orderBy: [desc(posts.timestamp)],
      limit: 20,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
