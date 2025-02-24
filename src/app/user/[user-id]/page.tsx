/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FollowButton from "~/components/FollowButton";
import { Post } from "~/components/Post";
import { Textarea } from "~/components/ui/textarea";
import { db } from "~/server/db";
import { posts, users } from "~/server/db/schema";

export default async function UserProfile({
  params,
}: {
  params: Promise<string>;
}) {
  const slug = await params;
  const userIdSlug = (slug as unknown as { "user-id": string })["user-id"];

  const user = await db.query.users.findFirst({
    where: eq(users.id, userIdSlug),
    with: {
      posts: true,
      comments: true,
      likes: true,
      receivedNotifications: true,
      createdNotifications: true,
      followedBy: true,
      following: true,
    },
  });
  console.log(user);

  if (!user) {
    notFound();
  }

  // Fetch follower details limited to 5 iterations
  const limitedFollowedBy = user.followedBy.slice(0, 5);
  const followerDetails = await Promise.all(
    limitedFollowedBy.map(async (follow) => {
      return await db.query.users.findFirst({
        where: eq(users.id, follow.followerId),
      });
    }),
  );

  // Fetch following details limited to 5 iterations
  const limitedFollowing = user.following.slice(0, 5);
  const followingDetails = await Promise.all(
    limitedFollowing.map(async (follow) => {
      return await db.query.users.findFirst({
        where: eq(users.id, follow.followingId),
      });
    }),
  );

  // For each post (from user.posts array), re-fetch the full post info from the database
  const postsWithFullInfo = await Promise.all(
    user.posts.map(async (postSummary) => {
      const fullPost = await db.query.posts.findFirst({
        where: eq(posts.id, postSummary.id),
        with: {
          // Fetch complete author details
          author: {
            columns: {
              id: true,
              username: true,
              avatar: true,
              email: true,
              bio: true,
              location: true,
              createdAt: true,
            },
          },
          // Also fetch comments with their authors
          comments: {
            with: {
              author: {
                columns: {
                  id: true,
                  username: true,
                  avatar: true,
                  location: true,
                },
              },
            },
          },
          likes: true,
        },
      });

      // Check if fullPost is defined
      if (!fullPost) return null; // Return null if fullPost is undefined

      // Map the properties to match the Post type
      return {
        id: fullPost.id,
        content: fullPost.content,
        image: fullPost.imageUrl, // Map imageUrl to image
        createdAt: new Date(fullPost.timestamp), // Convert timestamp string to Date
        authorId: fullPost.authorId,
        comments: fullPost.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          timestamp: comment.timestamp,
          authorId: comment.authorId,
          postId: comment.postId,
          author: {
            id: comment.author.id,
            username: comment.author.username,
            avatar: comment.author.avatar,
            location: comment.author.location ?? null,
          },
        })),
        likes: fullPost.likes.map((like) => like.userId), // Extract user IDs from likes
        author: fullPost.author,
      };
    }),
  );

  const validPosts = postsWithFullInfo.filter(Boolean);

  return (
    <main className="flex min-h-screen min-w-80 flex-col items-center p-4">
      <div className="my-6 flex items-center gap-4 md:gap-6">
        <div className="relative h-28 w-28 md:h-48 md:w-48">
          <Image
            src={user.avatar ?? "/default-avatar.png"}
            alt="avatar"
            fill
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-4xl font-semibold md:text-6xl">
            {user.username}
          </h1>
          <h3 className="text-lg font-normal md:text-2xl">{user.location}</h3>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-normal">
              Urmaritori{" "}
              <span className="font-semibold text-primary">
                {user.followedBy.length}
              </span>
            </h3>
            <h3 className="text-lg font-normal">
              Urmariti{" "}
              <span className="font-semibold text-primary">
                {user.following.length}
              </span>
            </h3>
          </div>
          <FollowButton
            followingId={user.id}
            className="mt-2 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-2 text-lg font-semibold text-white transition-transform hover:scale-105"
          ></FollowButton>
        </div>
      </div>
      {/* <FollowersFollwingTable userId={user.id} /> */}
      <div className="flex w-full max-w-96 flex-col items-start justify-start gap-2">
        <h1 className="text-2xl font-semibold">Bio</h1>
        <div className="relative w-full">
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-secondary"></div>
          <Textarea
            className="relative m-[1px] min-h-32 w-[calc(100%-2px)] bg-background"
            value={user.bio ?? "Utilizatorul nu are biografie"}
            readOnly
          />
        </div>
      </div>
      <div className="mt-9 flex w-full max-w-96 flex-row items-start justify-between gap-4">
        <div className="flex flex-col items-start justify-start gap-2">
          <Link
            href={`/user/${user.id}/followers`}
            className="text-2xl font-semibold hover:underline"
          >
            Urmaritori
          </Link>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            {followerDetails.map(
              (follower) =>
                follower && (
                  <Link key={follower.id} href={`/user/${follower.id}`}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Image
                        className="rounded-full"
                        src={follower.avatar ?? "/default-avatar.png"}
                        alt={`${follower.username}'s avatar`}
                        width={40}
                        height={40}
                      />
                      <h2 className="text-xl font-medium">
                        {follower.username}
                      </h2>
                    </div>
                  </Link>
                ),
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <Link
            href={`/user/${user.id}/following`}
            className="text-2xl font-semibold hover:underline"
          >
            Urmariti
          </Link>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            {followingDetails.map(
              (following) =>
                following && (
                  <Link key={following.id} href={`/user/${following.id}`}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Image
                        className="rounded-full"
                        src={following.avatar ?? "/default-avatar.png"}
                        alt={`${following.username}'s avatar`}
                        width={40}
                        height={40}
                      />
                      <h2 className="text-xl font-medium">
                        {following.username}
                      </h2>
                    </div>
                  </Link>
                ),
            )}
          </div>
        </div>
      </div>
      <div className="mt-9 flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background px-2 py-6 text-text">
        {validPosts.map((post) =>
          post ? <Post key={post.id} post={post} /> : null,
        )}
      </div>
    </main>
  );
}
