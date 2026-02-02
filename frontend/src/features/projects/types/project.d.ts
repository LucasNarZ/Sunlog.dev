import { Devlog } from '@/features/devlogs/types/devlog';

export interface Project {
	createdAt: Date;
	description: string;
	slug: string;
	id: string;
	name: string;
	authorSlug: string;
	readme: string;
	stars: int;
	updatedAt: date;
}
