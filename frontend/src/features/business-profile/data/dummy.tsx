export const dummyPosts = [
  {
    id: 'p1',
    author: { name: 'John Doe', avatar: 'https://i.pravatar.cc/40?u=j' },
    media: ['https://picsum.photos/400/400?random=1'],
    caption: 'First post 🎉 #hello',
    likes: 42,
    comments: 7,
    shares: 3,
    liked: false,
    bookmarked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    author: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/40?u=ja' },
    media: ['https://picsum.photos/400/500?random=2'],
    caption: 'Sunset vibes 🌅',
    likes: 128,
    comments: 12,
    shares: 5,
    liked: true,
    bookmarked: false,
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
  },
];

export const dummyReels = [
  {
    id: 'r1',
    author: { name: 'Reel King', avatar: 'https://i.pravatar.cc/40?u=rk' },
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    caption: 'Bouncing ball 🏀',
    likes: 312,
    comments: 28,
    shares: 11,
    liked: false,
    bookmarked: true,
    createdAt: new Date(Date.now() - 7_200_000).toISOString(),
  },
];