"use client";

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FollowButtonProps
  extends Omit<React.ComponentProps<"button">, "children"> {
  followingId: string;
}

export default function FollowButton({
  className,
  followingId,
  ...props
}: FollowButtonProps) {
  const { userId } = useParams();
  const { user, isLoaded } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(
          `/api/follow/check?followerId=${String(userId)}&followingId=${String(followingId)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to check follow status");
        }
        const data = (await response.json()) as { isFollowing: boolean };
        setIsFollowing(data.isFollowing);
      } catch {
        setIsFollowing(false);
      }
    };

    void checkFollowStatus();
  }, [user?.id, userId, followingId]);

  const handleToggleFollow = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "/api/follow/" + (isFollowing ? "delete" : "create"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            followerId: userId,
            followingId: followingId,
          }),
        },
      );
      console.log(response, userId, followingId);

      if (!response.ok) {
        throw new Error("Failed to toggle follow status");
      }

      setIsFollowing(!isFollowing);
    } catch {
      setIsLoading(false);
    }
  };

  // Don't show the button if user is not loaded or trying to follow themselves
  if (!isLoaded || user?.id === followingId) {
    return null;
  }

  // Don't show the button if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <button
      className={`rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-2 text-lg font-semibold text-white transition-transform hover:scale-105 disabled:opacity-50 ${className}`}
      onClick={handleToggleFollow}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : isFollowing ? "Nu urmari" : "Urmărește"}
    </button>
  );
}
