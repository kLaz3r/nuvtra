"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "~/components/Post";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { UploadButton, useUploadThing } from "~/utils/uploadthing";

const FeedPage = () => {
  const { user } = useUser();
  const router = useRouter();
  if (!user) {
    return null;
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-2 py-6 text-text">
      <CreatePost />
      <Post />
      <Post />
      <Post />
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

      console.log("post creted successfully");
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
        <div className="flex w-full items-center justify-between">
          <UploadButton
            endpoint={"imageUploader"}
            onClientUploadComplete={(res): void => {
              setFormData((prev) => ({
                ...prev,
                image: res[0]!.url,
              }));
            }}
          />
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
