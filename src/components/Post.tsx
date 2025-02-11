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
  imageUrl?: string | null;
  timestamp: Date;
  authorId: string;
  comments: any[];
  likes: {
    id: string;
    userId: string;
    postId: string;
  }[];
  author: User;
};

export const Post = ({ post }: { post: Post }) => {
  if (!post) {
    return null;
  }

  return (
    <div className="flex min-h-32 w-full max-w-[500px] flex-col items-start justify-start gap-4 rounded-lg bg-background p-6 shadow-post md:max-w-[650px]">
      <div className="flex w-full items-center justify-between">
        <a href={`/user/${post.authorId}`} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.author.avatar ?? "/default-avatar.png"} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold">{post.author.username}</h2>
        </a>
        <InteractionButtons
          likes={post.likes || []}
          postId={post.id}
          commentsNum={post.comments.length}
          mediaQuery="hidden md:flex"
        />
      </div>
      <p>{post.content}</p>
      {post.imageUrl && (
        <div className="relative h-96 w-full">
          <Image
            src={post.imageUrl}
            alt="post image"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      <InteractionButtons
        likes={post.likes || []}
        postId={post.id}
        commentsNum={post.comments.length}
        mediaQuery="md:hidden"
      />
    </div>
  );
};
