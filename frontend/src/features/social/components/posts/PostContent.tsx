// src/features/social/components/PostContent.tsx
import React from "react";
import { Textarea } from "@frontend/components/ui/textarea";

interface PostContentProps {
  content?: string;
  isEditing: boolean;
  editContent: string;
  onContentChange: (content: string) => void;
  isUpdating: boolean;
}

export const PostContent: React.FC<PostContentProps> = ({
  content,
  isEditing,
  editContent,
  onContentChange,
  isUpdating,
}) => {
  if (isEditing) {
    return (
      <Textarea
        value={editContent}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="What's on your mind?"
        disabled={isUpdating}
        className="min-h-[80px] resize-none mb-4"
      />
    );
  }

  return content ? (
    <div className="mb-4">
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  ) : null;
};
