import { commentRepositoryToken } from 'src/constants';
import { Comment } from './comment.entity';

export const commentProviders = [
	{
		provide: commentRepositoryToken,
		useValue: Comment,
	},
];
