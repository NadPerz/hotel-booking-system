import { IconButton } from '@frontend/components/ui/IconButton';
import { FC, useRef, useState } from 'react';


export interface Reel {
  id: string;
  author: { name: string; avatar: string };
  videoUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  bookmarked: boolean;
  createdAt: string;
}

interface Props { reel: Reel }

export const ReelCard: FC<Props> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(reel.liked);
  const [likes, setLikes] = useState(reel.likes);

  const togglePlay = () => {
    const v = videoRef.current!;
    if (playing) v.pause();
    else v.play();
    setPlaying((p) => !p);
  };

  const toggleLike = () => {
    setLiked((v) => {
      const next = !v;
      setLikes((n) => (next ? n + 1 : n - 1));
      return next;
    });
  };

  const share = (platform: string) => {
    const url = `${window.location.origin}/reel/${reel.id}`;
    const text = `Watch this reel: ${reel.caption}`;
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      threads: `https://threads.net/intent/post?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    window.open(shareUrls[platform] || shareUrls.twitter, '_blank');
  };

  return (
    <article className="bg-black rounded-xl overflow-hidden mb-4 relative">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="w-full h-[70vh] object-cover"
        loop
        playsInline
        onClick={togglePlay}
      />
      {/* overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
        <div className="flex items-center gap-3 mb-2">
          <img src={reel.author.avatar} alt="" className="w-8 h-8 rounded-full" />
          <span className="font-semibold text-sm">{reel.author.name}</span>
        </div>
        <p className="text-sm mb-2">{reel.caption}</p>

        <div className="flex items-center gap-4">
          <IconButton
            icon={liked ? '❤️' : '🤍'}
            label={String(likes)}
            onClick={toggleLike}
          />
          <IconButton icon="💬" label={String(reel.comments)} />
          <IconButton
            icon="📤"
            onClick={() => {
              const p = prompt('Share to: twitter, facebook, threads')?.toLowerCase();
              if (p) share(p);
            }}
          />
        </div>
      </div>

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="text-white text-5xl opacity-80"
          >
            ▶️
          </button>
        </div>
      )}
    </article>
  );
};