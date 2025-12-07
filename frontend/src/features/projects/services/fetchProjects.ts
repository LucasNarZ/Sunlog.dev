import { apiClient } from "@/lib/apiClient";

export async function fetchProjects() {
  try {
    const { data } = await apiClient.get(`/projects`);
    return data;
  } catch {
    return null;
  }
}
