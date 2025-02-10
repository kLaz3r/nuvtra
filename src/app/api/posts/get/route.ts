import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";

interface QueryOptions {
  with: {
    author: true;
    comments: true;
    likes: true;
  };
  orderBy: Array<ReturnType<typeof desc>>;
  offset?: number;
  limit?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skipParam = searchParams.get("skip");
    const limitParam = searchParams.get("limit");

    const queryOptions: QueryOptions = {
      with: {
        author: true,
        comments: true,
        likes: true,
      },
      orderBy: [desc(posts.timestamp), desc(posts.id)],
    };

    if (skipParam !== null && limitParam !== null) {
      const skip = parseInt(skipParam, 10);
      const limit = parseInt(limitParam, 10);
      if (!isNaN(skip) && !isNaN(limit)) {
        queryOptions.offset = skip;
        queryOptions.limit = limit;
      }
    }

    const allPosts = await db.query.posts.findMany(queryOptions);
    return NextResponse.json(allPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
