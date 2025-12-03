import { devlogEventRepositoryToken, usersRepositoryToken } from 'src/constants';
import { User } from './user.entity';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';

export const usersProviders = [
	{
		provide: usersRepositoryToken,
		useValue: User,
	},
	{
		provide: devlogEventRepositoryToken,
		useValue: DevlogEvent,
	},
];
