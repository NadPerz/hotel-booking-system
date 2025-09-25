"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "../../lib/post.api";
import PostCard from "./PostCard";
import { Skeleton } from "@frontend/components/ui/skeleton";
import PostListSkeleton from "./PostListSkeleton";
import { Post } from "../../types/social.types";

const STATIC_USER_ID = "68bb23a6701962edcadb67e0";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts(STATIC_USER_ID)
      .then((data) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // Optional: remove post from local list after deletion
  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  if (loading) return <PostListSkeleton count={5} />;

  return (
    <div>
      {posts.length === 0 ? (
        <div>No posts found.</div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default PostList;
