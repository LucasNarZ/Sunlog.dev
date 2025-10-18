import {
	postsRepositoryToken,
	usersRepositoryToken,
} from 'src/constants';
import { User } from 'src/user/user.entity';
import { Post } from 'src/post/post.entity';

export const adminProviders = [
	{
		provide: usersRepositoryToken,
		useValue: User,
	},
	{
		provide: postsRepositoryToken,
		useValue: Post 
	},
];
