import { devlogEventRepositoryToken, usersRepositoryToken } from 'src/constants';
import { User } from 'src/user/user.entity';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';

export const adminProviders = [
	{
		provide: usersRepositoryToken,
		useValue: User,
	},
	{
		provide: devlogEventRepositoryToken,
		useValue: DevlogEvent,
	}
];
