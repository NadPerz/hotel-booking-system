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
import { useState } from "react";

import { likePost, unlikePost } from "../lib/like.api";
import { addComment, deleteComment } from "../lib/comment.api";
import { deletePost } from "../lib/post.api";

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
  comments?: Comment[]; // If available; can update as your API expands
  createdAt?: string;
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
      // Optionally, trigger re-fetch of comments or pass up an event
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
          {post.user === STATIC_USER_ID && (
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircleIcon className="size-4" />
            <span className="ml-2">{post.commentCount}</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-3 border-t">
            <div className="space-y-3">
              {/* Comments mapping - replace with actual data if available */}
              {(post.comments || []).map((comment) => (
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
              ))}
            </div>
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
