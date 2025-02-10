import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { follows, users } from "~/server/db/schema";

export default async function FollowersPage({
  params,
}: {
  params: { "user-id": string };
}) {
  const userId = params["user-id"];

  // Fetch current user for context (e.g., page title)
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) {
    notFound();
  }

  // Fetch follow relationships where the current user is being followed
  const followerRelations = await db
    .select()
    .from(follows)
    .where(eq(follows.followingId, userId))
    .execute();

  // For each relation, fetch the full follower details
  const followerDetails = await Promise.all(
    followerRelations.map(async (relation) => {
      return await db.query.users.findFirst({
        where: eq(users.id, relation.followerId),
      });
    }),
  );
  const validFollowers = followerDetails.filter(Boolean);

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <h1 className="mb-8 text-4xl font-bold">{user.username} Urmăritori</h1>
      {validFollowers.length === 0 ? (
        <p>Acest utilizator nu are urmăritori.</p>
      ) : (
        <div className="grid w-full max-w-[650px] grid-cols-1 gap-4 md:grid-cols-2">
          {validFollowers.map((follower) => (
            <Link
              key={follower!.id}
              href={`/user/${follower!.id}`}
              className="flex items-center gap-4 rounded p-2 hover:bg-neutral-800"
            >
              <Image
                src={follower!.avatar || "/default-avatar.png"}
                alt={`${follower!.username}'s avatar`}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl font-medium">{follower!.username}</h2>
                {follower!.location && (
                  <p className="text-sm text-neutral-500">
                    {follower!.location}
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
