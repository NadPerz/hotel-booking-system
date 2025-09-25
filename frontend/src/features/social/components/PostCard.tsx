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
  PencilIcon,
  SaveIcon,
  XIcon,
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
import { deletePost, updatePost } from "../lib/post.api";
import {
  getSignedGetUrl,
  getSignedUploadUrl,
  uploadFileToSignedUrl,
} from "src/lib/media.api";
import { Skeleton } from "@frontend/components/ui/skeleton";
import CommentsLoadingSkeleton from "./CommentsLoadingSkeleton";

// Post type:  may want to import from a types file or shape to backend PostWithLikeStatus
export type Comment = {
  id: string;
  user: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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
  updatedAt?: string;
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

  //Editing related states
  const [isEditing, setIsEditing] = useState(false); // Controls edit mode
  const [editContent, setEditContent] = useState(post.content || ""); // Editable content
  const [editMediaFiles, setEditMediaFiles] = useState<File[]>([]); // New files to add
  const [editMediaToRemove, setEditMediaToRemove] = useState<string[]>([]); // Existing files to remove
  const [isUpdating, setIsUpdating] = useState(false); // Loading state for updates
  const [editMediaPreviewUrls, setEditMediaPreviewUrls] = useState<string[]>(
    []
  );

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

  // NEW FUNCTION: Toggle edit mode and reset edit state when cancelling
  /**
   * Toggles between edit and view mode.
   * When cancelling edit mode, resets all edit-related state to original values.
   */
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset all edit state to original values
      setEditContent(post.content || "");
      setEditMediaFiles([]);
      setEditMediaToRemove([]);
    }
    setIsEditing(!isEditing);
  };

  // NEW FUNCTION: Save post updates with comprehensive media management
  /**
   * Saves the post updates including content changes and media file management.
   * Handles uploading new media files and updating the post with all changes.
   * Uses transactions on the backend to ensure data consistency.
   */
  const handleSaveEdit = async () => {
    setIsUpdating(true);
    try {
      let mediaFilesToAdd: string[] = [];

      // Upload new media files if any were selected
      if (editMediaFiles.length > 0) {
        const bucket = "social-media";

        const uploadPromises = editMediaFiles.map(async (file) => {
          // Generate unique file path with timestamp and original name
          const timestamp = Date.now();
          const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_"); // Sanitize filename
          const filePath = `posts/${user}/${timestamp}_${safeName}`;
          const fileKey = `${bucket}/${filePath}`;

          // Get signed upload URL and upload the file directly to MinIO
          const signedUrl = await getSignedUploadUrl(filePath, bucket);
          await uploadFileToSignedUrl(file, signedUrl);

          return fileKey;
        });

        mediaFilesToAdd = await Promise.all(uploadPromises);
      }

      // Prepare update payload with only the fields that need updating
      const updatePayload: {
        content?: string;
        mediaFilesToAdd?: string[];
        mediaFilesToRemove?: string[];
      } = {};

      // Include content update (even if empty - allows clearing content)
      if (editContent !== post.content) {
        updatePayload.content = editContent;
      }

      // Include media additions if any
      if (mediaFilesToAdd.length > 0) {
        updatePayload.mediaFilesToAdd = mediaFilesToAdd;
      }

      // Include media removals if any
      if (editMediaToRemove.length > 0) {
        updatePayload.mediaFilesToRemove = editMediaToRemove;
      }

      // Send update request to backend
      const response = await updatePost(post.id, updatePayload);
      const updatedPost = response;

      // Update local post object with new values
      post.content = updatedPost.content;
      post.mediaFiles = updatedPost.mediaFiles;
      post.updatedAt = updatedPost.updatedAt;

      // Reset edit state
      setEditContent(updatedPost.content || "");
      setEditMediaFiles([]);
      setEditMediaToRemove([]);
      setIsEditing(false);

      // Refresh media URLs to show updated media
      // Simple approach: reload the page to refresh all signed URLs
      // In a more sophisticated app, you'd selectively update the URLs
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating post:", error);
      alert("Error updating post: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Marks an existing media file for removal from the post.
   * The file will be deleted when the update is saved.
   * @param mediaKey - The storage key of the media file to remove
   */
  const handleRemoveExistingMedia = (mediaKey: string) => {
    setEditMediaToRemove((prev) => {
      if (!prev.includes(mediaKey)) {
        return [...prev, mediaKey];
      }
      return prev;
    });
  };

  /**
   * Removes a media file from the removal list (undo removal).
   * @param mediaKey - The storage key of the media file to keep
   */
  const handleKeepExistingMedia = (mediaKey: string) => {
    setEditMediaToRemove((prev) => prev.filter((key) => key !== mediaKey));
  };

  /**
   * Handles file input changes for adding new media files.
   * Validates file types and adds them to the edit media list.
   * @param e - The file input change event
   */
  const handleAddEditMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Basic validation: check file types
    const validFiles = files.filter((file) => {
      return file.type.startsWith("image/") || file.type.startsWith("video/");
    });

    if (validFiles.length !== files.length) {
      alert("Some files were skipped. Only image and video files are allowed.");
    }

    if (validFiles.length > 0) {
      setEditMediaFiles((prev) => [...prev, ...validFiles]);
    }

    // Reset file input
    e.target.value = "";
  };

  /**
   * Removes a newly selected media file from the edit list (before upload).
   * @param index - The index of the file to remove
   */
  const handleRemoveNewMedia = (index: number) => {
    setEditMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditToggle}
                disabled={isUpdating}
                className="h-8 w-8 p-0"
              >
                {isEditing ? (
                  <XIcon className="h-4 w-4" />
                ) : (
                  <PencilIcon className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="h-8 w-8 p-0"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {/* <div className="mb-3">{post.content}</div> */}

        {/*  Content section - conditional rendering for edit mode */}
        {isEditing ? (
          //  Edit mode UI
          <div className="space-y-4 mb-4">
            {/* Content editor */}
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="What's on your mind?"
              disabled={isUpdating}
              className="min-h-[80px] resize-none"
            />

            {/* Current media management */}
            {signedMediaUrls.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">
                  Current Media:
                </div>
                <div className="flex flex-wrap gap-2">
                  {signedMediaUrls.map((url, index) => {
                    const mediaKey =
                      post.mediaFiles?.[index] || post.image || "";
                    const isMarkedForRemoval =
                      editMediaToRemove.includes(mediaKey);

                    return (
                      <div
                        key={index}
                        className={`relative group ${
                          isMarkedForRemoval ? "opacity-50" : ""
                        }`}
                      >
                        {isVideo(url) ? (
                          <video
                            src={url}
                            className="w-20 h-20 object-cover rounded border"
                            muted
                          />
                        ) : (
                          <img
                            src={url}
                            className="w-20 h-20 object-cover rounded border"
                            alt="Post media"
                          />
                        )}

                        {/* Remove/Keep button overlay */}
                        <Button
                          size="sm"
                          variant={
                            isMarkedForRemoval ? "default" : "destructive"
                          }
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            isMarkedForRemoval
                              ? handleKeepExistingMedia(mediaKey)
                              : handleRemoveExistingMedia(mediaKey)
                          }
                          disabled={isUpdating}
                          title={
                            isMarkedForRemoval
                              ? "Keep this media"
                              : "Remove this media"
                          }
                        >
                          {isMarkedForRemoval ? "+" : "×"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* New media preview */}
            {editMediaFiles.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">
                  New Media to Add:
                </div>
                <div className="flex flex-wrap gap-2">
                  {editMediaFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={editMediaPreviewUrls[index]}
                          className="w-20 h-20 object-cover rounded border"
                          alt="New media preview"
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video
                          src={editMediaPreviewUrls[index]}
                          className="w-20 h-20 object-cover rounded border"
                          muted
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center">
                          <div className="text-xs text-center p-1 text-gray-500">
                            {file.name.substring(0, 10)}...
                          </div>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveNewMedia(index)}
                        disabled={isUpdating}
                        title="Remove this new media"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add media input */}
            <div>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleAddEditMedia}
                disabled={isUpdating}
                className="hidden"
                id={`edit-media-${post.id}`}
              />
              <label htmlFor={`edit-media-${post.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  asChild
                  className="cursor-pointer"
                >
                  <span>
                    {editMediaFiles.length > 0
                      ? `Add More Media (${editMediaFiles.length} selected)`
                      : "Add Media"}
                  </span>
                </Button>
              </label>
            </div>

            {/* Save/Cancel buttons */}
            <div className="flex gap-2 justify-end pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="min-w-[100px]"
              >
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Existing view mode content display
          post.content && (
            <div className="mb-4">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          )
        )}

        {/* Media Carousel using shadcn/ui */}
        {!isEditing && signedMediaUrls.length > 0 && (
          <div className="mb-3">
            {mediaLoading && (
              <div className="space-y-2">
                {/* Media placeholder skeleton - rectangular to match image/video */}
                <Skeleton
                  className="w-full rounded-lg"
                  style={{ height: `${MAX_MEDIA_HEIGHT}px` }}
                />
                {/* Optional: Add skeleton for carousel controls if multiple items */}
                <div className="flex justify-center space-x-2">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                </div>
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
              <CommentsLoadingSkeleton />
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
