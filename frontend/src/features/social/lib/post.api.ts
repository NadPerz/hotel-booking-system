const API_BASE_URL = "http://localhost:3000/api/social";
const STATIC_USER_ID = "68bb23a6701962edcadb67e0";

// Post API
export const createPost = async (content: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: STATIC_USER_ID,
      content: content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

export const getAllPosts = async (userId?: string): Promise<any[]> => {
  // Build URL with optional userId query parameter
  const url = userId
    ? `${API_BASE_URL}/posts?userId=${encodeURIComponent(userId)}`
    : `${API_BASE_URL}/posts`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

export const deletePost = async (postId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: STATIC_USER_ID }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete post with ID: ${postId}`);
  }

  return response.json();
};
