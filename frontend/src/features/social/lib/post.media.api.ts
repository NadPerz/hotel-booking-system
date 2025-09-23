import { API_BASE_URL } from "./post.api";

// Request a signed upload URL from backend
export const getSignedUploadUrl = async (
  fileName: string,
  bucket?: string
): Promise<string> => {
  console.log("🚀 DEBUG: getSignedUploadUrl called with:", {
    fileName,
    bucket,
  });
  console.log("🚀 DEBUG: API_BASE_URL:", API_BASE_URL);

  const body: { fileName: string; bucket?: string } = { fileName };
  if (bucket) body.bucket = bucket;

  const url = `${API_BASE_URL}/media/signed-upload-url`;
  console.log("🚀 DEBUG: POST URL:", url);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log("🚀 DEBUG: Upload response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ DEBUG: Upload error:", errorText);
    throw new Error("Failed to get signed URL");
  }
  return (await response.json()).url;
};

// Request a signed GET URL for any file
export const getSignedGetUrl = async (
  filePath: string,
  expiry?: number
): Promise<string> => {
  console.log("🚀 DEBUG: getSignedGetUrl called with filePath:", filePath);
  console.log("🚀 DEBUG: API_BASE_URL:", API_BASE_URL);

  if (!filePath) throw new Error("filePath is required");
  const params = new URLSearchParams({ filePath });
  if (expiry) params.append("expiry", expiry.toString());

  const url = `${API_BASE_URL}/media/signed-get-url?${params.toString()}`;
  console.log("🚀 DEBUG: GET URL:", url);

  const response = await fetch(url);

  console.log("🚀 DEBUG: GET response status:", response.status);
  console.log("🚀 DEBUG: GET response ok:", response.ok);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ DEBUG: GET error:", errorText);
    throw new Error(
      `Failed to get signed URL: ${response.status} - ${errorText}`
    );
  }

  const jsonResponse = await response.json();
  console.log("🚀 DEBUG: GET response JSON:", jsonResponse);

  return jsonResponse.url;
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

// import { API_BASE_URL } from "./post.api";

// // Request a signed upload URL from backend
// export const getSignedUploadUrl = async (
//   fileName: string,
//   bucket?: string
// ): Promise<string> => {
//   const body: { fileName: string; bucket?: string } = { fileName };
//   if (bucket) body.bucket = bucket;

//   const response = await fetch(`${API_BASE_URL}/media/signed-upload-url`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
//   if (!response.ok) throw new Error("Failed to get signed URL");
//   return (await response.json()).url;
// };

// // Request a signed GET URL for any file
// export const getSignedGetUrl = async (
//   filePath: string,
//   expiry?: number
// ): Promise<string> => {
//   if (!filePath) throw new Error("filePath is required");
//   const params = new URLSearchParams({ filePath });
//   if (expiry) params.append("expiry", expiry.toString());
//   const response = await fetch(
//     `${API_BASE_URL}/media/signed-get-url?${params.toString()}`
//   );
//   if (!response.ok) throw new Error("Failed to get signed URL");
//   return (await response.json()).url;
// };

// // Upload file directly to MinIO signed URL
// export const uploadFileToSignedUrl = async (
//   file: File,
//   signedUrl: string
// ): Promise<string> => {
//   const uploadResponse = await fetch(signedUrl, {
//     method: "PUT",
//     headers: {
//       "Content-Type": file.type,
//     },
//     body: file,
//   });
//   if (!uploadResponse.ok) throw new Error("File upload failed");
//   // Return path without query params for DB reference
//   return signedUrl.split("?")[0];
// };
