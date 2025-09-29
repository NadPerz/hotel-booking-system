// hooks/useReels.ts
import { useEffect, useState } from 'react';
import { dummyReels } from '../data/dummy';

export const useReels = () => {
  const [reels, setReels] = useState(dummyReels);
  const [loading, setLoading] = useState(false);

  const refetch = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setReels([...dummyReels]);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { reels, loading, refetch };
};