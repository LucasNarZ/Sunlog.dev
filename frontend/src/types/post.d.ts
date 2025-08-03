export interface Post {
  id: string;
  title: string;
  content: string;
  description: string;
  previewImgUrl: string;
  createdAt: string;
  updatedAt: string;
  likesNumber: number;
  views: number;
  comments: string[];
  slug: string;
  userId: string;
  category: string;
  tags: string[];
}
