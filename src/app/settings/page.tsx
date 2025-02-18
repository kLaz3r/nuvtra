"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/dist/client/components/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { type User } from "~/components/Post";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

type FormData = {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  location: string;
  bio: string;
};

const SettingsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    username: "",
    email: "",
    location: "",
    bio: "",
    avatar: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      if (!user) return;

      try {
        const response = await fetch("/api/users/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get user data");
        }

        const userData = (await response.json()) as {
          username: string;
          email: string;
          location: string;
          bio: string;
          avatar: string;
          followedBy: User[];
          following: User[];
        };
        setFollowers(userData.followedBy.length);
        setFollowing(userData.following.length);
        setFormData({
          id: user.id,
          username: userData.username ?? "",
          email: userData.email ?? "",
          location: userData.location ?? "Romania",
          bio: userData.bio ?? "",
          avatar: userData.avatar ?? null,
        });
      } catch (error) {
        setError("Failed to fetch user data");
      }
    }
    void getData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Optional: Add success notification
      console.log("User updated successfully");
      router.push("/feed");
    } catch (error) {
      setError("Failed to update user");
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
    <div className="flex flex-col items-center justify-start gap-2 px-4 pt-12 md:gap-4">
      <div className="mb-6 flex items-center gap-4 md:gap-6">
        <div className="relative h-28 w-28 md:h-48 md:w-48">
          <Image
            src={formData.avatar ?? "/default-avatar.png"}
            alt="avatar"
            fill
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-4xl font-semibold md:text-6xl">
            {formData.username}
          </h1>
          <h3 className="text-lg font-normal md:text-2xl">
            {formData.location}
          </h3>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-normal">
              Urmaritori{" "}
              <span className="font-semibold text-primary">{followers}</span>
            </h3>
            <h3 className="text-lg font-normal">
              Urmariti{" "}
              <span className="font-semibold text-primary">{following}</span>
            </h3>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center justify-center gap-2"
      >
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-2xl font-semibold">Nume de utilizator</h1>
          <StyledInput
            placeholder="username"
            className="w-full"
            value={formData.username}
            onChange={handleChange("username")}
          />
        </div>

        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-2xl font-semibold">Email</h1>
          <StyledInput
            placeholder="Email"
            className="w-full"
            value={formData.email}
            onChange={handleChange("email")}
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="text-2xl font-semibold">Locatie</h1>
          <StyledInput
            placeholder="Locatie"
            className="w-full"
            value={formData.location}
            onChange={handleChange("location")}
          />
        </div>
        <div className="flex w-full max-w-96 flex-col items-start justify-start gap-2">
          <h1 className="text-2xl font-semibold">Bio</h1>
          <div className="relative w-full">
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-secondary"></div>
            <Textarea
              className="relative m-[1px] min-h-32 w-[calc(100%-2px)] bg-background"
              value={formData.bio}
              onChange={handleChange("bio")}
            />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-96 items-center justify-end">
          <Button
            type="submit"
            className="bg-primary px-8 py-6 text-xl font-bold text-background hover:bg-primary/80"
          >
            Salveaza
          </Button>
        </div>
      </form>
    </div>
  );
};

const StyledInput = ({
  placeholder,
  className,
  value,
  onChange,
}: {
  placeholder: string;
  className: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={cn("relative w-full md:w-96", className)}>
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-secondary"></div>
      <Input
        placeholder={placeholder}
        className="relative m-[1px] w-[calc(100%-2px)] bg-background"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SettingsPage;
