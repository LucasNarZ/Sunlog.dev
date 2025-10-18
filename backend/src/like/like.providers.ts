import { Post } from 'src/post/post.entity';
import { Like } from './like.entity';
import { likesRepositoryToken, postsRepositoryToken } from 'src/constants';

export const likeProviders = [
	{
		provide: likesRepositoryToken,
		useValue: Like,
	},
	{
		provide: postsRepositoryToken,
		useValue: Post,
	},
];
