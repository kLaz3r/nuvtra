"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

async function like(userId: string, postId: string) {
  const response = await fetch("/api/like/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, postId }),
  });
  if (!response.ok) {
    throw new Error("Failed to create like");
  }
  return response;
}

async function unlike(userId: string, postId: string) {
  const response = await fetch("/api/like/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, postId }),
  });
  if (!response.ok) {
    throw new Error("Failed to delete like");
  }
  return response;
}

type InteractionButtonsProps = {
  postId: string;
  mediaQuery: string;
  commentsNum: number;
  likes: {
    id: string;
    userId: string;
    postId: string;
  }[];
};

export default function InteractionButtons({
  postId,
  mediaQuery,
  commentsNum,
  likes,
}: InteractionButtonsProps) {
  const router = useRouter();
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likesNum, setLikesNum] = useState<number>(0);

  useEffect(() => {
    if (likes.some((like) => like.userId === user?.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setLikesNum(likes.length);
  }, [likes, user?.id]);

  const handleLikeToggle = async () => {
    if (liked) {
      // Unlike the post
      setLikesNum(likesNum - 1);
      setLiked(false);
      try {
        await unlike(user?.id ?? "", postId);
      } catch (error) {
        console.error(error);
        setLiked(true);
        setLikesNum(likesNum);
      }
    } else {
      // Like the post
      setLikesNum(likesNum + 1);
      setLiked(true);
      try {
        await like(user?.id ?? "", postId);
      } catch (error) {
        console.error(error);
        setLiked(false);
        setLikesNum(likesNum);
      }
    }
  };

  return (
    <div className={cn("flex items-center gap-4", mediaQuery)}>
      <button
        onClick={handleLikeToggle}
        className={`${
          liked
            ? "border border-accent bg-background text-accent"
            : "bg-accent text-background"
        } flex items-center gap-2 rounded-lg px-3 py-2 font-bold`}
      >
        <LikeSVG
          color={liked ? "rgba(120, 140, 173, 1)" : "rgba(10, 7, 6, 1)"}
        />
        <span>{likesNum}</span>
      </button>
      <button
        onClick={() => router.push(`/post/${postId}`)}
        className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 font-bold text-background"
      >
        <CommentSVG />
        <span>{commentsNum}</span>
      </button>
    </div>
  );
}

const LikeSVG = ({ color }: { color: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
    >
      <path
        d="M4.67188 10.0625H1.07812C0.482686 10.0625 0 10.5452 0 11.1406V21.9219C0 22.5173 0.482686 23 1.07812 23H4.67188C5.26731 23 5.75 22.5173 5.75 21.9219V11.1406C5.75 10.5452 5.26731 10.0625 4.67188 10.0625ZM2.875 21.2031C2.27956 21.2031 1.79688 20.7204 1.79688 20.125C1.79688 19.5296 2.27956 19.0469 2.875 19.0469C3.47044 19.0469 3.95312 19.5296 3.95312 20.125C3.95312 20.7204 3.47044 21.2031 2.875 21.2031ZM17.25 3.65898C17.25 5.56438 16.0834 6.63316 15.7551 7.90625H20.3247C21.825 7.90625 22.9929 9.15265 23 10.5161C23.0037 11.3219 22.661 12.1894 22.1267 12.7261L22.1218 12.7311C22.5636 13.7794 22.4918 15.2484 21.7036 16.301C22.0936 17.4642 21.7005 18.8932 20.9677 19.6592C21.1608 20.4497 21.0685 21.1225 20.6916 21.6642C19.7747 22.9814 17.5023 23 15.5807 23L15.4529 23C13.2837 22.9992 11.5084 22.2094 10.082 21.5748C9.36518 21.2559 8.42793 20.8611 7.71681 20.8481C7.42303 20.8427 7.1875 20.6029 7.1875 20.3091V10.7061C7.1875 10.5624 7.24509 10.4244 7.34733 10.3234C9.12687 8.56494 9.89207 6.70324 11.3506 5.2422C12.0157 4.57592 12.2575 3.56949 12.4913 2.59621C12.6911 1.76512 13.109 0 14.0156 0C15.0938 0 17.25 0.359375 17.25 3.65898Z"
        fill={color}
      />
    </svg>
  );
};

const CommentSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="23"
      viewBox="0 0 27 23"
      fill="none"
    >
      <path
        d="M13.1429 0C5.88348 0 0 4.77969 0 10.6786C0 13.225 1.09866 15.5558 2.92634 17.3886C2.2846 19.9761 0.138616 22.2813 0.112946 22.3069C0 22.425 -0.0308036 22.5996 0.0359375 22.7536C0.102679 22.9076 0.246429 23 0.410714 23C3.81451 23 6.36607 21.3674 7.62902 20.3612C9.30781 20.9926 11.1714 21.3571 13.1429 21.3571C20.4022 21.3571 26.2857 16.5775 26.2857 10.6786C26.2857 4.77969 20.4022 0 13.1429 0ZM6.57143 12.3214C5.66272 12.3214 4.92857 11.5873 4.92857 10.6786C4.92857 9.76987 5.66272 9.03571 6.57143 9.03571C7.48013 9.03571 8.21429 9.76987 8.21429 10.6786C8.21429 11.5873 7.48013 12.3214 6.57143 12.3214ZM13.1429 12.3214C12.2342 12.3214 11.5 11.5873 11.5 10.6786C11.5 9.76987 12.2342 9.03571 13.1429 9.03571C14.0516 9.03571 14.7857 9.76987 14.7857 10.6786C14.7857 11.5873 14.0516 12.3214 13.1429 12.3214ZM19.7143 12.3214C18.8056 12.3214 18.0714 11.5873 18.0714 10.6786C18.0714 9.76987 18.8056 9.03571 19.7143 9.03571C20.623 9.03571 21.3571 9.76987 21.3571 10.6786C21.3571 11.5873 20.623 12.3214 19.7143 12.3214Z"
        fill="black"
      />
    </svg>
  );
};
