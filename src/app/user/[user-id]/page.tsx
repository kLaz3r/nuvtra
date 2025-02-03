import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export default async function UserProfile({
  params,
}: {
  params: { "user-id": string };
}) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, params["user-id"]),
  });

  if (!user) {
    notFound();
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="flex w-full max-w-[650px] flex-col items-center gap-4 rounded-lg bg-background p-6 shadow-post">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p>User ID: {params["user-id"]}</p>
        <div className="flex w-full flex-col items-center gap-4">
          {user.avatar && (
            <Image
              src={user.avatar}
              alt={`${user.username}'s avatar`}
              width={100}
              height={100}
            />
          )}
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p>{user.bio}</p>
          <p>Location: {user.location}</p>
          <p>Joined: {formattedDate}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
