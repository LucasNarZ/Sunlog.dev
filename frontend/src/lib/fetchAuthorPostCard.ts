import { apiClient } from "./apiClient";
import type { Author } from "@/types/author";

export async function fetchAuthorPostCard(
  userId: string,
): Promise<Author | null> {
  try {
    const response = await apiClient.get(`/user/basic/${userId}`);
    if (!response.data) return null;
    return await response.data;
  } catch {
    return null;
  }
}
