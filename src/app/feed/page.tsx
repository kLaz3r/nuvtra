"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfinitePosts from "~/components/InfinitePosts.client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { UploadButton } from "~/utils/uploadthing";

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

const FeedPage = () => {
  const { isLoaded, user } = useUser();
  const [loadingState, setLoadingState] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function getData() {
      if (!isLoaded) {
        return null;
      }
      try {
        const response = await fetch("/api/users/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user!.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to get data");
        }

        const data = (await response.json()) as User;
        setCurrentUser(data);
        setLoadingState(false);
      } catch {
        setCurrentUser(null);
      }
    }
    void getData();
  }, [user]);

  if (!currentUser) {
    return null;
  }
  if (loadingState) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-4 bg-background px-2 py-6 text-text">
      <CreatePost currentUser={currentUser} />
      <InfinitePosts />
    </div>
  );
};

const CreatePost = ({ currentUser }: { currentUser: User }) => {
  const [formData, setFormData] = useState<FormData>({
    authorId: currentUser.id,
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
      window.location.reload();
    } catch {
      // Failed silently as the user will see the post didn't appear
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
      {currentUser && (
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={currentUser.avatar ?? "/default-avatar.png"} />
              <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">{currentUser.username}</h2>
          </div>
        </div>
      )}
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
              endpoint="imageUploader"
              onClientUploadComplete={(res): void => {
                setFormData((prev) => ({ ...prev, image: res[0]!.url }));
              }}
              appearance={{
                button:
                  "bg-primary hover:bg-primary/80 !text-black font-bold px-6 py-2 rounded-md whitespace-nowrap min-w-[120px]",
                allowedContent: "hidden",
              }}
              content={{
                button({ ready }) {
                  if (ready) return "Încarcă poza";
                  return "Se încarcă...";
                },
                allowedContent: "Poți încărca doar imagini",
              }}
            />
          ) : (
            <div></div>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 font-bold text-background"
          >
            Posteaza
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedPage;
