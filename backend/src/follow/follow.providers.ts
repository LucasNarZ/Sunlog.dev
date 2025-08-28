import {
	followsRepositoryToken,
	usersRepositoryToken,
} from 'src/constants';
import { User } from 'src/user/user.entity';
import { Follow } from './follow.entity';

export const followProviders = [
	{
		provide: usersRepositoryToken,
		useValue: User,
	},
	{
		provide: followsRepositoryToken,
		useValue: Follow
	},
];
