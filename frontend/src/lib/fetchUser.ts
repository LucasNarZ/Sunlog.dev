import { apiClient } from '@lib/apiClient';
import type { User } from '@/types/user';

export const fetchUser = async (): Promise<User | null> => {
    try {
        const response = await apiClient.get(`/user/profile`, {
            withCredentials: true,
        });
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

