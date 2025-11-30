import { apiClient } from "@/lib/apiClient";
import type { User } from "@/features/users/types/user";

export const getTrendingUsers = async (): Promise<User[]> => {
  try {
    const res = await apiClient.get("/users/trending");
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
