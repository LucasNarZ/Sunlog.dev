import { apiClient } from "./apiClient";

export async function getFollow(followerdId: string) {
  try {
    const { data } = await apiClient.get(`/follow/${followerdId}`);
    return data;
  } catch {
    return null;
  }
}
