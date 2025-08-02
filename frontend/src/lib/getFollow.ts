import { apiClient } from "./apiClient";

export async function getFollow(followerdId: string) {
  try {
    const { data } = await apiClient.get(`/post/follow/${followerdId}`);
    return data;
  } catch {
    return null;
  }
}
