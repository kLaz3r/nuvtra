import { Post } from "~/components/Post";

const FeedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background py-6 text-text">
      <Post />
      <Post />
      <Post />
    </div>
  );
};

export default FeedPage;
