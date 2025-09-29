'use client'; // remove if not Next.js app-dir

import { useState } from 'react';
import { usePosts } from '../../hooks/post';
import { useReels } from '../../hooks/reel';
import { PostSection } from './postSection';

export const FeedPage = () => {
  const [tab, setTab] = useState<'posts' | 'reels'>('posts');
  const { posts, loading: pLoading } = usePosts();
  const { reels, loading: rLoading } = useReels();

  const loading = tab === 'posts' ? pLoading : rLoading;

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* tab switcher */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 font-semibold ${tab === 'posts' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setTab('posts')}
        >
          Posts
        </button>
        <button
          className={`flex-1 py-2 font-semibold ${tab === 'reels' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setTab('reels')}
        >
          Reels
        </button>
      </div>

      <PostSection tab={tab} posts={posts} reels={reels} loading={loading} />
    </div>
  );
};