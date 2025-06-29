import { apiClient } from '@lib/apiClient';

export const fetchFilteredPosts = async (tags: string[], categories: string[]) => {
    console.log(tags)
    console.log(categories)
    try {
        const params = new URLSearchParams();
        tags.forEach(tag => params.append('tag', tag));
        categories.forEach(cat => params.append('category', cat));
        console.log(`/post?${params.toString()}`)
        const { data } = await apiClient.get(`/post?${params.toString()}`);
        return data;
    } catch (err){
        console.log(err)
        return null
    }
};
