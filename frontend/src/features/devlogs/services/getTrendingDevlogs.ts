import { apiClient } from "@/lib/apiClient";
import type { Post } from "@/features/devlogs/types/post";

export const getTrendingDevlogs = async (): Promise<Post[]> => {
  try {
    const res = await apiClient.get("/devlogEvents/trending");
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
