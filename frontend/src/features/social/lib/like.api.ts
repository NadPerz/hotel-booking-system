const API_BASE_URL = "http://localhost:3000/api/social";
const STATIC_USER_ID = "68bb23a6701962edcadb67e0";

// Like API
export const likePost = async (postId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: STATIC_USER_ID,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to like post: ${postId}`);
  }

  return response.json();
};

export const unlikePost = async (postId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: STATIC_USER_ID,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to unlike post: ${postId}`);
  }

  return response.json();
};
