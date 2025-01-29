"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "~/components/Post";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const FeedPage = () => {
  const { user } = useUser();
  const router = useRouter();
  if (!user) {
    router.push("/sign-in");
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

const CreatePost = () => {
  const { user } = useUser();
  useEffect(() => {
    setFormData({
      authorId: user!.id,
      bodyText: formData.bodyText,
      image: formData.image,
    });
  }, [user]);
  const router = useRouter();
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

      // Optional: Add success notification
      console.log("post creted successfully");
      // router.push("/feed");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  return (
    <div className="flex w-full max-w-[500px] flex-col items-start justify-start gap-4 rounded-lg bg-background p-6 shadow-post md:max-w-[650px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold">John Doe</h2>
        </div>
      </div>
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
          <label
            htmlFor="image"
            className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 font-bold text-background"
          >
            {/* <PhotoSVG />
          <span>Adauga imagine</span>
          <input
            value={formData.image ?? ""}
            onChange={handleChange("image")}
            type="file"
            name="image"
            id="image"
            className="hidden"
          /> */}
          </label>
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

const PhotoSVG = () => {
  return (
    <svg
      fill="#000000"
      height="20px"
      width="20px"
      version="1.1"
      id="Layer_1"
      viewBox="0 0 455 455"
    >
      <path
        d="M0,0v455h455V0H0z M259.405,80c17.949,0,32.5,14.551,32.5,32.5s-14.551,32.5-32.5,32.5s-32.5-14.551-32.5-32.5
	S241.456,80,259.405,80z M375,375H80v-65.556l83.142-87.725l96.263,68.792l69.233-40.271L375,299.158V375z"
      />
    </svg>
  );
};

export default FeedPage;
