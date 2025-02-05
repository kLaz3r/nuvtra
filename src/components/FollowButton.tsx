"use client";

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FollowButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  followingId: string;
}

export default function FollowButton({
  children,
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
          `/api/follow/check?followerId=${user.id}&followingId=${followingId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [user?.id, followingId]);

  const handleToggleFollow = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const endpoint = isFollowing
        ? "/api/follow/delete"
        : "/api/follow/create";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: user.id,
          followingId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle follow");
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
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
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
