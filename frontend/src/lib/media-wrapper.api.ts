// Use the same environment variable as the main API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Request a signed upload URL from backend
export const getSignedUploadUrl = async (
  fileName: string,
  bucket?: string
): Promise<string> => {
  const body: { fileName: string; bucket?: string } = { fileName };
  if (bucket) body.bucket = bucket;

  console.log('🚀 Media API - Requesting signed upload URL:', { fileName, bucket, API_BASE_URL });

  const response = await fetch(`${API_BASE_URL}/media/signed-upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log('📡 Media API - Upload URL response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Media API - Failed to get signed URL:', errorText);
    throw new Error(`Failed to get signed URL: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('✅ Media API - Got signed URL:', result.url);
  return result.url;
};

// Request a signed GET URL for any file
export const getSignedGetUrl = async (
  filePath: string,
  expiry?: number
): Promise<string> => {
  if (!filePath) throw new Error("filePath is required");
  const params = new URLSearchParams({ filePath });
  if (expiry) params.append("expiry", expiry.toString());
  
  const response = await fetch(
    `${API_BASE_URL}/media/signed-get-url?${params.toString()}`
  );
  if (!response.ok) throw new Error("Failed to get signed URL");
  return (await response.json()).url;
};

// Upload file directly to MinIO signed URL
export const uploadFileToSignedUrl = async (
  file: File,
  signedUrl: string
): Promise<string> => {
  console.log('📤 Media API - Uploading file to Minio:', { fileName: file.name, size: file.size });
  
  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
  
  if (!uploadResponse.ok) {
    console.error('❌ Media API - File upload failed:', uploadResponse.status, uploadResponse.statusText);
    throw new Error("File upload failed");
  }
  
  // Return path without query params for DB reference
  const fileUrl = signedUrl.split("?")[0];
  console.log('✅ Media API - File uploaded successfully:', fileUrl);
  return fileUrl;
};