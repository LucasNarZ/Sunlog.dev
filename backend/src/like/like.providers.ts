import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';
import { Like } from './like.entity';
import { likesRepositoryToken, devlogEventRepositoryToken } from 'src/constants';

export const likeProviders = [
	{
		provide: likesRepositoryToken,
		useValue: Like,
	},
	{
		provide: devlogEventRepositoryToken,
		useValue: DevlogEvent,
	},
];
