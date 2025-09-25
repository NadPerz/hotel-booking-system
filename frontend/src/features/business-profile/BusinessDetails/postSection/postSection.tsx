import { FC } from 'react';
import { PostCard, Post } from './postCard';
import { ReelCard, Reel } from './ReelCard';

type Tab = 'posts' | 'reels';

interface Props {
  tab: Tab;
  posts: Post[];
  reels: Reel[];
  loading: boolean;
}

export const PostSection: FC<Props> = ({ tab, posts, reels, loading }) => {
  if (loading) return <p className="p-4 text-center">Loading…</p>;

  if (tab === 'posts')
    return (
      <>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </>
    );

  return (
    <>
      {reels.map((r) => (
        <ReelCard key={r.id} reel={r} />
      ))}
    </>
  );
};