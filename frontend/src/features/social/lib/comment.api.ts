//comment.api.ts

const API_BASE_URL = "http://localhost:3000/api/social";
const STATIC_USER_ID = "68bb23a6701962edcadb67e0";

// Comment API
export const addComment = async (
  postId: string,
  content: string
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
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
    throw new Error(`Failed to add comment to post: ${postId}`);
  }

  return response.json();
};

export const deleteComment = async (
  postId: string,
  commentId: string
): Promise<any> => {
  const response = await fetch(
    `${API_BASE_URL}/posts/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: STATIC_USER_ID }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to delete comment ${commentId} from post: ${postId}`
    );
  }

  return response.json();
};
