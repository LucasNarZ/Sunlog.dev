import { apiClient } from "../../../lib/apiClient";

export async function fetchDevlog(slug: string) {
  try {
    const { data } = await apiClient.get(`/posts/slug/${slug}`);
    return data;
  } catch {
    return null;
  }
}
