import {
	postsRepositoryToken,
	usersRepositoryToken,
} from 'src/constants';
import { User } from './user.entity';
import { Post } from 'src/post/post.entity';

export const usersProviders = [
	{
		provide: usersRepositoryToken,
		useValue: User,
	},
	{
		provide: postsRepositoryToken,
		useValue: Post,
	},
];
