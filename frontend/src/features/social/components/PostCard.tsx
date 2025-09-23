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

import { likePost, unlikePost } from "../lib/like.api";
import { addComment, deleteComment, getComments } from "../lib/comment.api";
import { deletePost } from "../lib/post.api";
import { getSignedGetUrl } from "src/lib/media.api";

// Post type: you may want to import from a types file or shape to backend PostWithLikeStatus
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
  //comments?: Comment[]; // If available; can update as your API expands
  createdAt?: string;
  image?: string;
};

const STATIC_USER_ID = "68bb23a6701962edcadb67e0";

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
  // You can pass additional props as needed
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
  // ADDED state for image signed URL
  const [imageSignedUrl, setImageSignedUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const user = STATIC_USER_ID;

  useEffect(() => {
    const fetchImageSignedUrl = async () => {
      if (post.image) {
        console.log(
          "🔍 DEBUG: Fetching signed URL for image path:",
          post.image
        );

        setImageLoading(true);
        setImageError(false);
        try {
          const signedUrl = await getSignedGetUrl(post.image);
          console.log("✅ DEBUG: Successfully got signed URL:", signedUrl);

          setImageSignedUrl(signedUrl);
        } catch (error) {
          console.error("❌ DEBUG: Failed to get signed URL for image:", error);
          console.error("❌ DEBUG: Image path that failed:", post.image);
          console.error("Failed to get signed URL for image:", error);
          setImageError(true);
        } finally {
          setImageLoading(false);
        }
      }
    };

    fetchImageSignedUrl();
  }, [post.image]);

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

        {/* POST IMAGE //Old one
        {post.image && (
          <div className="rounded-lg border overflow-hidden">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-auto object-cover"
            />
          </div>
        )} */}

        {/* POST IMAGE - UPDATED to use signed URL */}
        {post.image && (
          <div className="rounded-lg overflow-hidden mb-3">
            {imageLoading && (
              <div className="flex items-center justify-center h-32 bg-gray-100">
                <div className="text-gray-500">Loading image...</div>
              </div>
            )}
            {imageError && (
              <div className="flex items-center justify-center h-32 bg-gray-100">
                <div className="text-red-500">Failed to load image</div>
              </div>
            )}
            {!imageLoading && !imageError && imageSignedUrl && (
              <img
                src={imageSignedUrl}
                alt="Post content"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  console.error(
                    "❌ DEBUG: Image failed to load from URL:",
                    imageSignedUrl
                  );
                  setImageError(true);
                }}
                onLoad={() => {
                  console.log(
                    "✅ DEBUG: Image successfully loaded from URL:",
                    imageSignedUrl
                  );
                }}
              />
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
