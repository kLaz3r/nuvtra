import Image from "next/image";
import InteractionButtons from "~/components/InteractionButtons.client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export type User = {
  id: string;
  username: string;
  email: string;
  bio: string;
  createdAt: string;
  location: string;
  avatar: string | null;
};

export type Post = {
  id: string;
  content: string;
  image: string | null;
  createdAt: string;
  author: User;
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
  likes: string[];
};

export const Post = ({ post }: { post: Post }) => {
  if (!post) {
    return null;
  }

  // Transform likes array to match InteractionButtons expected type
  const transformedLikes = (post.likes || []).map((userId) => ({
    id: `${post.id}-${userId}`, // Generate a unique ID
    userId,
    postId: post.id,
  }));

  return (
    <div className="flex min-h-32 w-full max-w-[500px] flex-col items-start justify-start gap-4 rounded-lg bg-background p-6 shadow-post md:max-w-[650px]">
      <div className="flex w-full items-center justify-between">
        <a href={`/user/${post.author.id}`} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.author.avatar ?? "/default-avatar.png"} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold">{post.author.username}</h2>
        </a>
        <InteractionButtons
          likes={transformedLikes}
          postId={post.id}
          commentsNum={post.comments.length}
          mediaQuery="hidden md:flex"
        />
      </div>
      <p>{post.content}</p>
      {post.image && (
        <div className="relative h-96 w-full">
          <Image
            src={post.image}
            alt="post image"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      <InteractionButtons
        likes={transformedLikes}
        postId={post.id}
        commentsNum={post.comments.length}
        mediaQuery="md:hidden"
      />
    </div>
  );
};
