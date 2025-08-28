import { Like } from '../like/like.entity';
import { Post } from './post.entity';
import { likesRepositoryToken, postsRepositoryToken } from 'src/constants';

export const postsProviders = [
	{
		provide: postsRepositoryToken,
		useValue: Post,
	},
	{
		provide: likesRepositoryToken,
		useValue: Like,
	},
];
