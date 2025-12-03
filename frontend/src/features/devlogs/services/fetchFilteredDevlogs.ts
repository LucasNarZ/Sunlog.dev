import { apiClient } from "@lib/apiClient";

export const fetchFilteredDevlogs = async (
  tags: string[],
  categories: string[],
) => {
  try {
    const params = new URLSearchParams();
    tags.forEach((tag) => params.append("tag", tag));
    categories.forEach((cat) => params.append("category", cat));
    const { data } = await apiClient.get(`/devlogEvents?${params.toString()}`);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
