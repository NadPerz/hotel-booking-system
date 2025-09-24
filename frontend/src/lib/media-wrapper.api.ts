import { ResourceType, getBucketConfig, generateFileName } from './bucket-manager';

// Remove /api prefix to match your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Enhanced upload with dynamic bucket support
export const uploadToResourceBucket = async (
  file: File,
  resourceType: ResourceType,
  userId: string = 'NadPerz'
): Promise<string> => {
  try {
    const bucketConfig = getBucketConfig(resourceType);
    const fileName = generateFileName(resourceType, file.name, userId);
    
    console.log(`🪣 ${resourceType.toUpperCase()} Bucket Upload:`, {
      resourceType,
      bucketName: bucketConfig.bucketName,
      fileName,
      userId
    });

    // Get signed URL with dynamic bucket
    const signedUrl = await getSignedUploadUrl(fileName, bucketConfig.bucketName);
    console.log(`✅ Got signed URL for ${bucketConfig.bucketName}`);
    
    // Upload file
    await uploadFileToSignedUrl(file, signedUrl);
    
    // Return the PATH (bucket/filename), not full HTTP URL
    const filePath = `${bucketConfig.bucketName}/${fileName}`;
    console.log(`✅ File uploaded to ${bucketConfig.bucketName}, returning path:`, filePath);
    
    return filePath;
    
  } catch (error) {
    console.error(`❌ ${resourceType} upload failed:`, error);
    throw error;
  }
};

export const getSignedUploadUrl = async (
  fileName: string,
  bucket?: string
): Promise<string> => {
  const body: { fileName: string; bucket?: string } = { fileName };
  if (bucket) body.bucket = bucket;

  console.log('🚀 Requesting signed upload URL:', { fileName, bucket, API_BASE_URL });

  // Remove /api prefix from media endpoints
  const response = await fetch(`${API_BASE_URL}/media/signed-upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get signed URL: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  return result.url;
};

export const uploadFileToSignedUrl = async (
  file: File,
  signedUrl: string
): Promise<void> => {
  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
  
  if (!uploadResponse.ok) {
    throw new Error("File upload failed");
  }
  
  console.log('✅ File uploaded successfully to Minio');
};

export const getSignedGetUrl = async (
  filePath: string,
  expiry?: number
): Promise<string> => {
  if (!filePath) throw new Error("filePath is required");
  
  const params = new URLSearchParams({ filePath });
  if (expiry) params.append("expiry", expiry.toString());
  
  console.log('🔍 Getting signed GET URL for path:', filePath);
  
  // Remove /api prefix from media endpoints
  const response = await fetch(
    `${API_BASE_URL}/media/signed-get-url?${params.toString()}`
  );
  
  if (!response.ok) {
    throw new Error("Failed to get signed GET URL");
  }
  
  const result = await response.json();
  console.log('✅ Got signed GET URL for:', filePath);
  return result.url;
};