import { apiClient } from "./apiClient";

export async function getPost(slug: string) {
  try {
    const { data } = await apiClient.get(`/post/${slug}`);
    return data;
  } catch {
    return null;
  }
}
