// hooks/usePosts.ts
import { useEffect, useState } from 'react';
import { dummyPosts } from '../data/dummy';

export const usePosts = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [loading, setLoading] = useState(false);

  const refetch = async () => {
    setLoading(true);
    // simulate network
    await new Promise((r) => setTimeout(r, 600));
    setPosts([...dummyPosts]); // clone to trigger re-render
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { posts, loading, refetch };
};