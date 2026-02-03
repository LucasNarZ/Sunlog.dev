import { Project } from './project';
import { Devlog } from './devlog';

export interface User {
	id: string;
	name: string;
	slug: string;
	email?: string;
	password?: string;
	followersNumber: number;
	profileImgUrl: string;
	bio: string;
	createdAt: string;
	updatedAt: string;

	projects?: Project[];
	devlogs?: Devlog[];
}
