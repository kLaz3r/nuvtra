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

    // If we have a userId, get their followed users' posts first
    if (userId) {
      // Get the IDs of users that the current user follows
      const followedUsers = await db
        .select({ followingId: follows.followingId })
        .from(follows)
        .where(eq(follows.followerId, userId));

      const followedUserIds = followedUsers.map((f) => f.followingId);

      // Get posts from followed users
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

      // Get all other posts
      const otherPosts = await db.query.posts.findMany({
        where:
          followedUserIds.length > 0
            ? and(
                not(inArray(posts.authorId, followedUserIds)),
                not(eq(posts.authorId, userId)), // Don't show user's own posts twice
              )
            : not(eq(posts.authorId, userId)), // If not following anyone, just exclude own posts
        with: {
          author: true,
          comments: true,
          likes: true,
        },
        orderBy: [desc(posts.timestamp), desc(posts.id)],
      });

      // Combine the posts, with followed users' posts first
      const allPosts = [...followedPosts, ...otherPosts];

      // Apply pagination if needed
      if (skipParam !== null && limitParam !== null) {
        const skip = parseInt(skipParam, 10);
        const limit = parseInt(limitParam, 10);
        if (!isNaN(skip) && !isNaN(limit)) {
          return NextResponse.json(allPosts.slice(skip, skip + limit));
        }
      }

      return NextResponse.json(allPosts);
    }

    // If no userId, return all posts with normal pagination
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
