import { useState } from "react";
import { likePost, unlikePost } from "../lib/like.api";
import { addComment, getComments, deleteComment } from "../lib/comment.api";
import { deletePost } from "../lib/post.api";
import { Post, Comment } from "../types/social.types";

const STATIC_USER_ID = "68bb23a6701962edcadb67e0";

export const usePostInteractions = (
  post: Post,
  onDelete?: (id: string) => void
) => {
  // Like state
  const [hasLiked, setHasLiked] = useState(post.userLiked ?? false);
  const [optimisticLikes, setOptimisticLikes] = useState(post.likeCount ?? 0);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  // Delete state
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
  const handleAddComment = async (content: string) => {
    if (!content.trim()) return;
    setIsCommenting(true);
    try {
      await addComment(post.id, content);
      setCommentText("");
      // Refetch comments after posting (for accurate display)
      if (showComments) {
        setLoadingComments(true);
        const updated = await getComments(post.id);
        // Temporarily increment commentCount in frontend until screen refresh
        post.commentCount = post.commentCount + 1;
        setComments(updated);
        setLoadingComments(false);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setIsCommenting(false);
  };

  // Delete post
  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      if (onDelete) onDelete(post.id); // Remove from list in parent
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    setIsDeleting(false);
  };

  // Toggle comments and fetch if needed
  const handleShowComments = async () => {
    setShowComments(!showComments);
    if (!commentsLoaded && !showComments) {
      // only fetch if opening
      setLoadingComments(true);
      try {
        const fetchedComments = await getComments(post.id);
        setComments(fetchedComments);
        setCommentsLoaded(true);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
      setLoadingComments(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(post.id, commentId);
      // Remove comment from local state
      setComments(comments.filter((comment) => comment.id !== commentId));
      // Decrement comment count
      post.commentCount = Math.max(0, post.commentCount - 1);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return {
    // Like state
    hasLiked,
    optimisticLikes,

    // Comment state
    showComments,
    commentText,
    setCommentText,
    isCommenting,
    comments,
    loadingComments,

    // Delete state
    isDeleting,

    // Actions
    handleLike,
    handleAddComment,
    handleDeletePost,
    handleShowComments,
    handleDeleteComment,

    // Current user
    currentUserId: STATIC_USER_ID,
  };
};
