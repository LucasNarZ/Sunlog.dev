import { apiClient } from "./apiClient";

export async function getAuthor(userId:string) {
    try {
        const { data } = await apiClient.get(`/user/` + userId);
        return data;
    } catch  {
        return null;
    }
}