"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "~/components/Post";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { UploadButton } from "~/utils/uploadthing";

export type PostProps = {
  id: string;
  content: string;
  imageUrl: string;
  timestamp: string;
  authorId: string;
  comments: [];
  likes: [];
  author: User;
};

const FeedPage = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<PostProps[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("/api/posts/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to get data");
        }

        console.log("data fetch gud");
        const data = (await response.json()) as Post[];
        setPosts(data);
      } catch (error) {
        console.error("Error geting data:", error);
      }
    }
    void getData();
  }, [user]);
  if (posts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-2 py-6 text-text">
        <span className="loader"></span>
      </div>
    );
  }
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-2 py-6 text-text">
      <CreatePost />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export type FormData = {
  authorId: string;
  bodyText: string;
  image: string | null;
};

type User = {
  id: string;
  username: string;
  email: string;
  bio: string;
  createdAt: string;
  location: string;
  avatar: string | null;
};

const CreatePost = () => {
  const { user } = useUser();
  useEffect(() => {
    async function getData() {
      try {
        console.log("geting user", user!.id);
        const response = await fetch("/api/users/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user!.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get data");
        }

        console.log("user fetch gud");
        const data = (await response.json()) as User;
        setCurrentUser(data);
      } catch (error) {
        console.error("Error geting user:", error);
      }
    }
    void getData();

    setFormData({
      authorId: user!.id,
      bodyText: formData.bodyText,
      image: formData.image,
    });
  }, [user]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    authorId: user!.id,
    bodyText: "",
    image: null,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      console.log("post created successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  const handleChange =
    (field: keyof typeof formData) =>
    async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  return (
    <div className="flex w-full max-w-[500px] flex-col items-start justify-start gap-4 rounded-lg bg-background p-6 shadow-post md:max-w-[650px]">
      {currentUser ? (
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={currentUser.avatar ?? ""} />
              <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">{currentUser.username}</h2>
          </div>
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-start justify-start gap-2"
      >
        <textarea
          placeholder="La ce te gandesti?"
          value={formData.bodyText}
          onChange={handleChange("bodyText")}
          className="h-32 w-full rounded-lg border border-primary bg-background p-4 text-text outline-none"
        ></textarea>
        {formData.image && (
          <div className="relative h-96 w-full">
            <Image
              src={formData.image}
              alt="post image"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
        <div className="flex w-full items-center justify-between">
          {formData.image === null ? (
            <UploadButton
              endpoint={"imageUploader"}
              onClientUploadComplete={(res): void => {
                setFormData((prev) => ({
                  ...prev,
                  image: res[0]!.url,
                }));
              }}
            />
          ) : (
            <div></div>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 font-bold text-background"
          >
            Posteaza
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedPage;
