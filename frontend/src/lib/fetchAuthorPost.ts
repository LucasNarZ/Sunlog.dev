import { apiClient } from "./apiClient";

export async function getAuthor(userId: string) {
  try {
    const { data } = await apiClient.get(`user/public/` + userId);
    return data;
  } catch {
    return null;
  }
}
