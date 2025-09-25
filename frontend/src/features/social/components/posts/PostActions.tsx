// src/features/social/components/PostActions.tsx
import React from "react";
import { Button } from "@frontend/components/ui/button";
import { HeartIcon, MessageCircleIcon } from "lucide-react";

interface PostActionsProps {
  hasLiked: boolean;
  optimisticLikes: number;
  commentCount: number;
  onLike: () => void;
  onToggleComments: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  hasLiked,
  optimisticLikes,
  commentCount,
  onLike,
  onToggleComments,
}) => {
  return (
    <div className="flex items-center gap-3 mb-2">
      <Button
        variant="ghost"
        size="sm"
        className={hasLiked ? "text-red-500" : ""}
        onClick={onLike}
      >
        <HeartIcon className="size-4" />
        <span className="ml-2">{optimisticLikes}</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={onToggleComments}>
        <MessageCircleIcon className="size-4" />
        <span className="ml-2">{commentCount}</span>
      </Button>
    </div>
  );
};
