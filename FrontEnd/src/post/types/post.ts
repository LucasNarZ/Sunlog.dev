export interface Post {
	id: string;
	title: string;
	content: string;
	description: string;
	previewImgUrl: string;
	authorId: string;
	createdAt: string;
	updatedAt: string;
	likes: number;
	views: number;
	comments: string[];
	slug: string;
	userId: string;
	category: string;
	tags: string[];
}
