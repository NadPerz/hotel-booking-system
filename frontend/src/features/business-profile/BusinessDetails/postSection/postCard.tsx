import { FC, useState } from 'react';
import { IconButton } from '@frontend/components/ui/IconButton';

export interface Post {
  id: string;
  author: { name: string; avatar: string };
  media: string[];
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  bookmarked: boolean;
  createdAt: string;
}

interface Props { post: Post }

export const PostCard: FC<Props> = ({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [bookmarked, setBookmarked] = useState(post.bookmarked);
  const [likes, setLikes] = useState(post.likes);

  const toggleLike = () => {
    setLiked((v) => {
      const next = !v;
      setLikes((n) => (next ? n + 1 : n - 1));
      return next;
    });
  };

  const share = (platform: string) => {
    const url = `${window.location.origin}/post/${post.id}`;
    const text = `Check out this post: ${post.caption}`;
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      instagram: '', // IG has no web share; open native if available
      threads: `https://threads.net/intent/post?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    window.open(shareUrls[platform] || shareUrls.twitter, '_blank');
  };

  return (
    <article className="bg-white rounded-xl shadow mb-4">
      {/* header */}
      <div className="flex items-center gap-3 p-3">
        <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full" />
        <span className="font-semibold text-sm">{post.author.name}</span>
      </div>

      {/* media */}
      <div className="px-3">
        {post.media.map((src) => (
          <img key={src} src={src} className="w-full object-cover rounded" alt="" />
        ))}
      </div>

      {/* actions */}
      <div className="flex items-center justify-between p-3">
        <div className="flex gap-4">
          <IconButton
            icon={liked ? '❤️' : '🤍'}
            label={String(likes)}
            onClick={toggleLike}
          />
          <IconButton icon="💬" label={String(post.comments)} />
        </div>
        <IconButton
          icon="📤"
          onClick={() => {
            const p = prompt('Share to: twitter, facebook, threads')?.toLowerCase();
            if (p) share(p);
          }}
        />
      </div>

      {/* caption */}
      <div className="px-3 pb-3 text-sm">
        <span className="font-semibold">{post.author.name}</span> {post.caption}
      </div>
    </article>
  );
};