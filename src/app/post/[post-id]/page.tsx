"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Post as PostType } from "~/components/Post";
import { Post } from "~/components/Post";

export default function PostPage() {
  const { user } = useUser();
  const params = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getPost() {
      try {
        const response = await fetch(
          `/api/posts/get/${String(params["post-id"])}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to get post");
        }

        const data = (await response.json()) as PostType;
        setPost(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setPost(null);
      }
    }
    void getPost();
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-2 py-6 text-text">
        <span className="loader"></span>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  if (!post) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-4 bg-background px-2 py-6 text-text">
      <div className="flex w-full max-w-[650px] flex-col items-center justify-between gap-4">
        <Post post={post} />
        <CreateComment />
        <Comments comments={post.comments} />
      </div>
    </div>
  );
}

type CommentsProps = {
  comments: {
    id: string;
    content: string;
    timestamp: string;
    author: {
      id: string;
      username: string;
      avatar: string | null;
    };
  }[];
};

const Comments = ({ comments }: CommentsProps) => {
  if (comments.length === 0) {
    return null;
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Chiar acum";
    }
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `acum ${minutes} ${minutes === 1 ? "minut" : "minute"}`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `acum ${hours} ${hours === 1 ? "oră" : "ore"}`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `acum ${days} ${days === 1 ? "zi" : "zile"}`;
    }
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  comments.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="flex w-full max-w-[500px] flex-col items-start justify-start gap-4 rounded-lg bg-background p-6 shadow-post md:max-w-[650px]">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex w-full flex-col items-start justify-between gap-2"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={comment.author.avatar ?? "/default-avatar.png"}
                width={20}
                height={20}
                alt="comment author avatar"
                className="h-8 w-8 rounded-full"
              />
              <p className="text-sm font-semibold">{comment.author.username}</p>
            </div>
            <p className="text-text-muted text-sm">
              {formatTimestamp(comment.timestamp)}
            </p>
          </div>
          <p className="text-text-muted text-sm">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

const CreateComment = () => {
  const params = useParams();
  const { user } = useUser();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: String(params["post-id"]),
          content: comment,
          userId: user?.id ?? "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      window.location.reload();
    } catch (error) {
      setError("Error creating comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-end justify-start gap-2"
    >
      <textarea
        placeholder="Adaugă un comentariu..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="h-32 w-full rounded-lg border border-primary bg-background p-4 text-text outline-none"
      ></textarea>
      {error && <p className="text-error">{error}</p>}
      {isLoading ? (
        <span className="loader"></span>
      ) : (
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 font-bold text-background"
        >
          Postează
        </button>
      )}
    </form>
  );
};
