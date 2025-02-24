import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { follows, users } from "~/server/db/schema";

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ "user-id": string }>;
}) {
  const { "user-id": userId } = await params;

  // Fetch the current user's details for context (e.g. page title)
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) {
    notFound();
  }

  // Query to get all follow relationships where the current user is following others
  const followingRelations = await db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userId))
    .execute();

  // Fetch full details for each followed user
  const followingDetails = await Promise.all(
    followingRelations.map(async (relation) => {
      return await db.query.users.findFirst({
        where: eq(users.id, relation.followingId),
      });
    }),
  );
  const validFollowing = followingDetails.filter(Boolean);

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <h1 className="mb-8 text-4xl font-bold">{user.username} Urmărește</h1>
      {validFollowing.length === 0 ? (
        <p>Acest utilizator nu urmează pe nimeni.</p>
      ) : (
        <div className="grid w-full max-w-[650px] grid-cols-1 gap-4 md:grid-cols-2">
          {validFollowing.map((following) => (
            <Link
              key={following!.id}
              href={`/user/${following!.id}`}
              className="flex items-center gap-4 rounded p-2 hover:bg-neutral-800"
            >
              <Image
                src={following!.avatar ?? "/default-avatar.png"}
                alt={`${following!.username}'s avatar`}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl font-medium">{following!.username}</h2>
                {following!.location && (
                  <p className="text-sm text-neutral-500">
                    {following!.location}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
