"use client";

import { Button } from "@frontend/components/ui/button";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Textarea } from "@frontend/components/ui/textarea";
import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
// import { useUser } from "@clerk/nextjs";
// import { SetStateAction, useState } from "react";

import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { useState } from "react";
import { createPost, STATIC_USER_ID } from "../lib";
import { getSignedUploadUrl, uploadFileToSignedUrl } from "src/lib/media.api";

const CreatePost = () => {
  const user = `${STATIC_USER_ID}`;
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    setIsPosting(true);
    let uploadedImageUrl = "";
    let fileKeyStored = "";

    try {
      //If image selected, get signed URL and upload
      if (selectedImage) {
        const bucket = "social-media";
        const fileName = `posts/${user}/${Date.now()}_${selectedImage.name}`;
        fileKeyStored = `${bucket}/${fileName}`;
        const signedUrl = await getSignedUploadUrl(fileName, bucket);
        uploadedImageUrl = await uploadFileToSignedUrl(
          selectedImage,
          signedUrl
        );
        setImageUrl(uploadedImageUrl);
      }

      //Create the post with image reference
      await createPost(content, fileKeyStored);

      setContent("");
      setSelectedImage(null);
      setImageUrl("");
      setShowImageUpload(false);
    } catch (error: any) {
      alert("Error posting: " + error.message);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/alien-profile-pic-1.jpg" />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {/* TODO: Handle Image uploads */}
          {/* {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )} */}
          {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSelectedImage(file || null);
                }}
                disabled={isPosting}
              />
              {/* Optional preview: */}
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview"
                  className="max-w-xs rounded mt-2"
                />
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
