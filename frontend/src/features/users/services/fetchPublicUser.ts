import { apiClient } from "../../../lib/apiClient";

export async function fetchPublicUser(userId: string) {
  try {
    const { data } = await apiClient.get(`users/` + userId);
    return data;
  } catch {
    return null;
  }
}
