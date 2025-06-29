import { apiClient } from "./apiClient"

export async function getIsUserLoggedUser() {
    try{
        const { data } = await apiClient.get("/user/me/id", {
            withCredentials: true
        });
        return data;
    }catch {
        return null;
    }
}