import { API_BASE_URL } from "./post.api";

// Request a signed upload URL from backend
export const getSignedUploadUrl = async (fileName: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/media/signed-upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName }),
  });
  if (!response.ok) throw new Error("Failed to get signed URL");
  return (await response.json()).url;
};

// Upload file directly to MinIO signed URL
export const uploadFileToSignedUrl = async (
  file: File,
  signedUrl: string
): Promise<string> => {
  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!uploadResponse.ok) throw new Error("File upload failed");
  // Return path without query params for DB reference
  return signedUrl.split("?")[0];
};
