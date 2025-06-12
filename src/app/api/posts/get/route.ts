import { and, desc, eq, inArray, not } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { follows, posts } from "~/server/db/schema";

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
    const userId = searchParams.get("userId");

    if (userId) {
      const followedUsers = await db
        .select({ followingId: follows.followingId })
        .from(follows)
        .where(eq(follows.followerId, userId));

      const followedUserIds = followedUsers.map((f) => f.followingId);

      const followedPosts =
        followedUserIds.length > 0
          ? await db.query.posts.findMany({
              where: inArray(posts.authorId, followedUserIds),
              with: {
                author: true,
                comments: true,
                likes: true,
              },
              orderBy: [desc(posts.timestamp), desc(posts.id)],
            })
          : [];

      const otherPosts = await db.query.posts.findMany({
        where: not(inArray(posts.authorId, followedUserIds)),
        with: {
          author: true,
          comments: true,
          likes: true,
        },
        orderBy: [desc(posts.timestamp), desc(posts.id)],
      });

      const allPosts = [...followedPosts, ...otherPosts];

      if (skipParam !== null && limitParam !== null) {
        const skip = parseInt(skipParam, 10);
        const limit = parseInt(limitParam, 10);
        if (!isNaN(skip) && !isNaN(limit)) {
          return NextResponse.json(allPosts.slice(skip, skip + limit));
        }
      }

      return NextResponse.json(allPosts);
    }

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
