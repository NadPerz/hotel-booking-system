"use client";

import { Card, CardContent } from "@frontend/components/ui/card";
import { Button } from "@frontend/components/ui/button";
import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { Textarea } from "@frontend/components/ui/textarea";
import {
  HeartIcon,
  MessageCircleIcon,
  SendIcon,
  TrashIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@frontend/components/ui/carousel";

import { likePost, unlikePost } from "../lib/like.api";
import { addComment, deleteComment, getComments } from "../lib/comment.api";
import { deletePost } from "../lib/post.api";
import { getSignedGetUrl } from "src/lib/media.api";

// Post type:  may want to import from a types file or shape to backend PostWithLikeStatus
export type Comment = {
  id: string;
  user: string;
  content: string;
  createdAt: string;
};

export type Post = {
  id: string;
  user: string;
  content?: string;
  likeCount: number;
  commentCount: number;
  userLiked?: boolean;
  //comments?: Comment[]; // If available; can update as API expands
  createdAt?: string;
  image?: string; // Kept for backward compatibility
  mediaFiles?: string[];
};

const STATIC_USER_ID = "68bb23a6701962edcadb67e0";

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const [hasLiked, setHasLiked] = useState(post.userLiked ?? false);
  const [optimisticLikes, setOptimisticLikes] = useState(post.likeCount ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  //Media state
  const [signedMediaUrls, setSignedMediaUrls] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const MAX_MEDIA_HEIGHT = 500; // px
  const [mediaContainerHeight, setMediaContainerHeight] = useState<
    number | null
  >(null);

  const user = STATIC_USER_ID;

  useEffect(() => {
    const fetchSignedUrls = async () => {
      const mediaKeys =
        post.mediaFiles && post.mediaFiles.length > 0
          ? post.mediaFiles
          : post.image
          ? [post.image] // fallback
          : [];

      if (mediaKeys.length === 0) return;

      setMediaLoading(true);
      setMediaError(false);
      setMediaContainerHeight(null);
      try {
        const urls = await Promise.all(
          mediaKeys.map((k) => getSignedGetUrl(k))
        );
        setSignedMediaUrls(urls);
      } catch (err) {
        console.error("Error fetching signed media URLs", err);
        setMediaError(true);
      } finally {
        setMediaLoading(false);
      }
    };

    fetchSignedUrls();
  }, [post.mediaFiles, post.image]);

  //height calculation logic
  const handleFirstMediaHeight = (naturalHeight: number, index: number) => {
    // Only set height based on the first media item and only if not already set
    if (index === 0 && mediaContainerHeight === null) {
      // Use the smaller of natural height or MAX_HEIGHT (true maximum behavior)
      const calculatedHeight = Math.min(naturalHeight, MAX_MEDIA_HEIGHT);
      setMediaContainerHeight(calculatedHeight);
    }
  };

  // Like handling
  const handleLike = async () => {
    if (hasLiked) {
      setOptimisticLikes(optimisticLikes - 1);
      setHasLiked(false);
      await unlikePost(post.id);
    } else {
      setOptimisticLikes(optimisticLikes + 1);
      setHasLiked(true);
      await likePost(post.id);
    }
  };

  // Add comment handling
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setIsCommenting(true);
    try {
      await addComment(post.id, commentText);
      setCommentText("");
      //Optionally refetch comments after posting (for accurate display)
      if (showComments) {
        setLoadingComments(true);
        const updated = await getComments(post.id);
        //And temporarily incrementing commentCount in frontend until a screen refresh can bring the updated values
        post.commentCount = post.commentCount + 1;
        setComments(updated);
        setLoadingComments(false);
      }
    } catch {}
    setIsCommenting(false);
  };

  // Delete post
  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      if (onDelete) onDelete(post.id); // Remove from list in parent
    } catch {}
    setIsDeleting(false);
  };

  //To fetch comments only when opening the comments section for the first time
  const handleShowComments = async () => {
    setShowComments(!showComments);
    if (!commentsLoaded && !showComments) {
      // only fetch if opening
      setLoadingComments(true);
      try {
        const fetchedComments = await getComments(post.id);
        setComments(fetchedComments);
        setCommentsLoaded(true);
      } catch (e) {
        // Optionally display error
      }
      setLoadingComments(false);
    }
  };

  // ⭐ REMOVED: currentMedia helper (no longer needed)
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url.split("?")[0]);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex space-x-3 mb-2">
          <Avatar>
            <AvatarImage src="/alien-profile-pic-1.jpg" />
          </Avatar>
          <div>
            <div className="font-semibold">User: {post.user}</div>
            <div className="text-xs text-gray-500">
              {post.createdAt && formatDistanceToNow(new Date(post.createdAt))}{" "}
              ago
            </div>
          </div>
          {post.user === user && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDeletePost}
              disabled={isDeleting}
            >
              <TrashIcon className="size-4" />
            </Button>
          )}
        </div>
        <div className="mb-3">{post.content}</div>

        {/* Media Carousel using shadcn/ui */}
        {signedMediaUrls.length > 0 && (
          <div className="mb-3">
            {mediaLoading && (
              <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                Loading media...
              </div>
            )}
            {mediaError && (
              <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg text-red-500">
                Failed to load media
              </div>
            )}
            {!mediaLoading && !mediaError && (
              <Carousel className="w-full">
                <CarouselContent>
                  {signedMediaUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div
                        className="relative rounded-lg overflow-hidden flex items-center justify-center bg-gray-100"
                        style={{
                          //  Use calculated height or fallback, with max-height constraint
                          height: mediaContainerHeight
                            ? `${mediaContainerHeight}px`
                            : `${MAX_MEDIA_HEIGHT}px`,
                          maxHeight: `${MAX_MEDIA_HEIGHT}px`, //  Explicit max-height constraint
                        }}
                      >
                        {isVideo(url) ? (
                          <video
                            src={url}
                            controls
                            className="max-h-full max-w-full object-contain bg-black"
                            style={{ maxHeight: `${MAX_MEDIA_HEIGHT}px` }}
                            onLoadedMetadata={(e) => {
                              const h = (e.target as HTMLVideoElement)
                                .videoHeight;
                              handleFirstMediaHeight(h, index);
                            }}
                          />
                        ) : (
                          <img
                            src={url}
                            alt="Post media"
                            className="max-h-full max-w-full object-contain bg-gray-200"
                            style={{ maxHeight: `${MAX_MEDIA_HEIGHT}px` }}
                            onLoad={(e) => {
                              const h = (e.target as HTMLImageElement)
                                .naturalHeight;
                              handleFirstMediaHeight(h, index);
                            }}
                          />
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/*  shadcn carousel navigation (only show if multiple items) */}
                {signedMediaUrls.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            )}
          </div>
        )}

        {/* Like and comment buttons */}
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            className={hasLiked ? "text-red-500" : ""}
            onClick={handleLike}
          >
            <HeartIcon className="size-4" />
            <span className="ml-2">{optimisticLikes}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShowComments}>
            <MessageCircleIcon className="size-4" />
            <span className="ml-2">{post.commentCount}</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-3 border-t">
            {loadingComments ? (
              <div>Loading comments...</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <Avatar>
                    <AvatarImage src="/alien-profile-pic-1.jpg" />
                  </Avatar>
                  <div>
                    <div className="text-xs font-medium">{comment.user}</div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </div>
                    <div>{comment.content}</div>
                  </div>
                </div>
              ))
            )}
            <div className="flex items-end gap-2 mt-4">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[40px] resize-none"
                disabled={isCommenting}
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!commentText.trim() || isCommenting}
              >
                {isCommenting ? (
                  "Posting..."
                ) : (
                  <>
                    <SendIcon className="size-3 mr-1" />
                    Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;

// "use client";

// import { Card, CardContent } from "@frontend/components/ui/card";
// import { Button } from "@frontend/components/ui/button";
// import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
// import { Textarea } from "@frontend/components/ui/textarea";
// import {
//   ChevronLeft,
//   ChevronRight,
//   HeartIcon,
//   MessageCircleIcon,
//   SendIcon,
//   TrashIcon,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { useEffect, useState } from "react";

// import { likePost, unlikePost } from "../lib/like.api";
// import { addComment, deleteComment, getComments } from "../lib/comment.api";
// import { deletePost } from "../lib/post.api";
// import { getSignedGetUrl } from "src/lib/media.api";

// // Post type: you may want to import from a types file or shape to backend PostWithLikeStatus
// export type Comment = {
//   id: string;
//   user: string;
//   content: string;
//   createdAt: string;
// };

// export type Post = {
//   id: string;
//   user: string;
//   content?: string;
//   likeCount: number;
//   commentCount: number;
//   userLiked?: boolean;
//   //comments?: Comment[]; // If available; can update as your API expands
//   createdAt?: string;
//   image?: string; // Kept for backward compatibility
//   mediaFiles?: string[];
// };

// const STATIC_USER_ID = "68bb23a6701962edcadb67e0";

// interface PostCardProps {
//   post: Post;
//   onDelete?: (id: string) => void;
// }

// const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
//   const [hasLiked, setHasLiked] = useState(post.userLiked ?? false);
//   const [optimisticLikes, setOptimisticLikes] = useState(post.likeCount ?? 0);
//   const [showComments, setShowComments] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [isCommenting, setIsCommenting] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [commentsLoaded, setCommentsLoaded] = useState(false);
//   // ADDED state for image signed URL
//   // const [imageSignedUrl, setImageSignedUrl] = useState<string>("");
//   // const [imageLoading, setImageLoading] = useState(false);
//   // const [imageError, setImageError] = useState(false);

//   //Media state
//   const [signedMediaUrls, setSignedMediaUrls] = useState<string[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [mediaLoading, setMediaLoading] = useState(false);
//   const [mediaError, setMediaError] = useState(false);
//   const MAX_MEDIA_HEIGHT = 500; // px
//   const [mediaContainerHeight, setMediaContainerHeight] =
//     useState<number>(MAX_MEDIA_HEIGHT);

//   const user = STATIC_USER_ID;

//   useEffect(() => {
//     const fetchSignedUrls = async () => {
//       const mediaKeys =
//         post.mediaFiles && post.mediaFiles.length > 0
//           ? post.mediaFiles
//           : post.image
//           ? [post.image] // fallback
//           : [];

//       if (mediaKeys.length === 0) return;

//       setMediaLoading(true);
//       setMediaError(false);
//       try {
//         const urls = await Promise.all(
//           mediaKeys.map((k) => getSignedGetUrl(k))
//         );
//         // console.log(" mediaKeys:", mediaKeys);
//         // console.log(" signedMediaUrls:", urls);
//         setSignedMediaUrls(urls);
//       } catch (err) {
//         console.error("Error fetching signed media URLs", err);
//         setMediaError(true);
//       } finally {
//         setMediaLoading(false);
//       }
//     };

//     fetchSignedUrls();
//   }, [post.mediaFiles, post.image]);

//   //Capture natural height of the FIRST media to set a fixed container height
//   const handleFirstMediaHeight = (naturalHeight: number) => {
//     setMediaContainerHeight((prev) =>
//       prev === MAX_MEDIA_HEIGHT
//         ? Math.min(naturalHeight, MAX_MEDIA_HEIGHT)
//         : prev
//     );
//   };

//   // Like handling
//   const handleLike = async () => {
//     if (hasLiked) {
//       setOptimisticLikes(optimisticLikes - 1);
//       setHasLiked(false);
//       await unlikePost(post.id);
//     } else {
//       setOptimisticLikes(optimisticLikes + 1);
//       setHasLiked(true);
//       await likePost(post.id);
//     }
//   };

//   // Add comment handling
//   const handleAddComment = async () => {
//     if (!commentText.trim()) return;
//     setIsCommenting(true);
//     try {
//       await addComment(post.id, commentText);
//       setCommentText("");
//       //Optionally refetch comments after posting (for accurate display)
//       if (showComments) {
//         setLoadingComments(true);
//         const updated = await getComments(post.id);
//         //And temporarily incrementing commentCount in frontend until a screen refresh can bring the updated values
//         post.commentCount = post.commentCount + 1;
//         setComments(updated);
//         setLoadingComments(false);
//       }
//     } catch {}
//     setIsCommenting(false);
//   };

//   // Delete post
//   const handleDeletePost = async () => {
//     setIsDeleting(true);
//     try {
//       await deletePost(post.id);
//       if (onDelete) onDelete(post.id); // Remove from list in parent
//     } catch {}
//     setIsDeleting(false);
//   };

//   //To fetch comments only when opening the comments section for the first time
//   const handleShowComments = async () => {
//     setShowComments(!showComments);
//     if (!commentsLoaded && !showComments) {
//       // only fetch if opening
//       setLoadingComments(true);
//       try {
//         const fetchedComments = await getComments(post.id);
//         setComments(fetchedComments);
//         setCommentsLoaded(true);
//       } catch (e) {
//         // Optionally display error
//       }
//       setLoadingComments(false);
//     }
//   };

//   //Helper added for multiple media display
//   const currentMedia = signedMediaUrls[currentIndex] ?? "";
//   const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url.split("?")[0]);

//   return (
//     <Card className="mb-4">
//       <CardContent className="p-4">
//         <div className="flex space-x-3 mb-2">
//           <Avatar>
//             <AvatarImage src="/alien-profile-pic-1.jpg" />
//           </Avatar>
//           <div>
//             <div className="font-semibold">User: {post.user}</div>
//             <div className="text-xs text-gray-500">
//               {post.createdAt && formatDistanceToNow(new Date(post.createdAt))}{" "}
//               ago
//             </div>
//           </div>
//           {post.user === user && (
//             <Button
//               size="icon"
//               variant="ghost"
//               onClick={handleDeletePost}
//               disabled={isDeleting}
//             >
//               <TrashIcon className="size-4" />
//             </Button>
//           )}
//         </div>
//         <div className="mb-3">{post.content}</div>

//         {/* POST IMAGE //Old one
//         {post.image && (
//           <div className="rounded-lg border overflow-hidden">
//             <img
//               src={post.image}
//               alt="Post content"
//               className="w-full h-auto object-cover"
//             />
//           </div>
//         )} */}

//         {/* POST IMAGE - UPDATED to use signed URL */}

//         {/* ⭐ Media Carousel */}
//         {signedMediaUrls.length > 0 && (
//           <div
//             className="relative rounded-lg overflow-hidden mb-3 flex items-center justify-center bg-gray-100"
//             style={{ height: `${mediaContainerHeight}px` }}
//           >
//             {mediaLoading && (
//               <div className="flex items-center justify-center h-48 bg-gray-100">
//                 Loading media...
//               </div>
//             )}
//             {mediaError && (
//               <div className="flex items-center justify-center h-48 bg-gray-100 text-red-500">
//                 Failed to load media
//               </div>
//             )}
//             {!mediaLoading && !mediaError && currentMedia && (
//               <>
//                 {isVideo(currentMedia) ? (
//                   <video
//                     src={currentMedia}
//                     controls
//                     className="max-h-full max-w-full object-contain bg-black" // ⭐ CHANGED
//                     onLoadedMetadata={(e) => {
//                       if (currentIndex === 0) {
//                         const h = (e.target as HTMLVideoElement).videoHeight;
//                         handleFirstMediaHeight(h);
//                       }
//                     }}
//                   />
//                 ) : (
//                   <img
//                     src={currentMedia}
//                     alt="Post media"
//                     className="max-h-full max-w-full object-contain bg-gray-200" // ⭐ CHANGED
//                     onLoad={(e) => {
//                       if (currentIndex === 0) {
//                         const h = (e.target as HTMLImageElement).naturalHeight;
//                         handleFirstMediaHeight(h);
//                       }
//                     }}
//                   />
//                 )}

//                 {/* Navigation Arrows */}
//                 {signedMediaUrls.length > 1 && (
//                   <>
//                     <button
//                       className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"
//                       onClick={() =>
//                         setCurrentIndex(
//                           (prev) =>
//                             (prev - 1 + signedMediaUrls.length) %
//                             signedMediaUrls.length
//                         )
//                       }
//                     >
//                       <ChevronLeft className="h-6 w-6" />
//                     </button>
//                     <button
//                       className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"
//                       onClick={() =>
//                         setCurrentIndex(
//                           (prev) => (prev + 1) % signedMediaUrls.length
//                         )
//                       }
//                     >
//                       <ChevronRight className="h-6 w-6" />
//                     </button>

//                     {/* Dots */}
//                     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
//                       {signedMediaUrls.map((_, i) => (
//                         <span
//                           key={i}
//                           className={`h-2 w-2 rounded-full ${
//                             i === currentIndex ? "bg-white" : "bg-white/40"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {/* {post.image && (
//           <div className="rounded-lg overflow-hidden mb-3">
//             {imageLoading && (
//               <div className="flex items-center justify-center h-32 bg-gray-100">
//                 <div className="text-gray-500">Loading image...</div>
//               </div>
//             )}
//             {imageError && (
//               <div className="flex items-center justify-center h-32 bg-gray-100">
//                 <div className="text-red-500">Failed to load image</div>
//               </div>
//             )}
//             {!imageLoading && !imageError && imageSignedUrl && (
//               <img
//                 src={imageSignedUrl}
//                 alt="Post content"
//                 className="w-full h-auto object-cover"
//                 onError={(e) => {
//                   console.error(
//                     "❌ DEBUG: Image failed to load from URL:",
//                     imageSignedUrl
//                   );
//                   setImageError(true);
//                 }}
//                 onLoad={() => {
//                   console.log(
//                     "✅ DEBUG: Image successfully loaded from URL:",
//                     imageSignedUrl
//                   );
//                 }}
//               />
//             )}
//           </div>
//         )} */}

//         {/* Like and comment buttons */}
//         <div className="flex items-center gap-3 mb-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             className={hasLiked ? "text-red-500" : ""}
//             onClick={handleLike}
//           >
//             <HeartIcon className="size-4" />
//             <span className="ml-2">{optimisticLikes}</span>
//           </Button>
//           <Button variant="ghost" size="sm" onClick={handleShowComments}>
//             <MessageCircleIcon className="size-4" />
//             <span className="ml-2">{post.commentCount}</span>
//           </Button>
//         </div>

//         {/* Comments Section */}
//         {showComments && (
//           <div className="pt-3 border-t">
//             {loadingComments ? (
//               <div>Loading comments...</div>
//             ) : (
//               comments.map((comment) => (
//                 <div key={comment.id} className="flex items-start gap-2">
//                   <Avatar>
//                     <AvatarImage src="/alien-profile-pic-1.jpg" />
//                   </Avatar>
//                   <div>
//                     <div className="text-xs font-medium">{comment.user}</div>
//                     <div className="text-xs text-gray-500">
//                       {formatDistanceToNow(new Date(comment.createdAt))} ago
//                     </div>
//                     <div>{comment.content}</div>
//                   </div>
//                 </div>
//               ))
//             )}
//             <div className="flex items-end gap-2 mt-4">
//               <Textarea
//                 placeholder="Write a comment..."
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 className="min-h-[40px] resize-none"
//                 disabled={isCommenting}
//               />
//               <Button
//                 size="sm"
//                 onClick={handleAddComment}
//                 disabled={!commentText.trim() || isCommenting}
//               >
//                 {isCommenting ? (
//                   "Posting..."
//                 ) : (
//                   <>
//                     <SendIcon className="size-3 mr-1" />
//                     Comment
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default PostCard;
