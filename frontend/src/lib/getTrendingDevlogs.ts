import { apiClient } from "./apiClient"
import type { Post } from "@/types/post"

export const getTrendingDevlogs = async (): Promise<Post[]> => {
  try {
    const res = await apiClient.get('/post/trending-devlogs')
    return res.data
  } catch(err) {
    console.error(err)
    return []
  }
}