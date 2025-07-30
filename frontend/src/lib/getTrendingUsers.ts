import { apiClient } from "./apiClient"
import type { User } from "@/types/user"

export const getTrendingUsers = async (): Promise<User[]> => {
  try {
    const res = await apiClient.get('/user/trending-users')
    return res.data
  } catch(err) {
    console.error(err)
    return []
  }
}