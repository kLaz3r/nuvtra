import Link from "next/link";
import React from "react";
import { type Post, type User, Post as PostComponent } from "~/components/Post";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Await the searchParams promise to get the actual value
  const { q } = await searchParams;
  const searchQuery = q ?? "";

  // Get the base URL from an environment variable or default to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Call the search API endpoints using the search query.
  // Using { cache: "no-store" } ensures the data is fresh on every request.
  const postRes = await fetch(
    new URL(
      `/api/search/posts?searchQuery=${encodeURIComponent(searchQuery)}`,
      baseUrl,
    ),
    { cache: "no-store" },
  );
  const posts = (await postRes.json()) as Post[];

  const userRes = await fetch(
    new URL(
      `/api/search/users?searchQuery=${encodeURIComponent(searchQuery)}`,
      baseUrl,
    ),
    { cache: "no-store" },
  );
  const users = (await userRes.json()) as User[];

  // Limit results to 20 of each
  const limitedPosts = posts.slice(0, 20);
  const limitedUsers = users.slice(0, 20);

  return (
    <main className="mx-auto max-w-[1500px] p-6">
      <h1 className="mb-4 text-2xl font-bold">
        Rezultate pentru &quot;{searchQuery}&quot;
      </h1>
      {/* On big displays, show two columns; on mobile, stack users then posts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Users Column */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Utilizatori</h2>
          {limitedUsers.length === 0 ? (
            <p>Nu am găsit utilizatori.</p>
          ) : (
            <div className="space-y-4">
              {limitedUsers.map((user: User) => (
                <Link key={user.id} href={`/user/${user.id}`}>
                  <div className="relative rounded bg-gradient-to-r from-primary to-secondary p-[1px]">
                    <div className="flex items-center gap-4 rounded bg-background p-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          className="h-12 w-12"
                          src={user.avatar ?? "/default-avatar.png"}
                        />
                        <AvatarFallback className="h-12 w-12 text-xl">
                          {user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.username}</h3>
                        {user.bio && (
                          <p className="text-muted text-sm">{user.bio}</p>
                        )}
                        {user.location && (
                          <p className="text-sm text-gray-600">
                            {user.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Posts Column */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Postări</h2>
          {limitedPosts.length === 0 ? (
            <p>Nu am găsit postări.</p>
          ) : (
            <div className="space-y-4">
              {limitedPosts.map((post: Post) => (
                <PostComponent key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
