import { Like } from '../like/like.entity';
import { DevlogEvent } from './devlog-event.entity';
import {
	likesRepositoryToken,
	devlogEventRepositoryToken,
} from 'src/constants';

export const devlogEventsProviders = [
	{
		provide: devlogEventRepositoryToken,
		useValue: DevlogEvent,
	},
	{
		provide: likesRepositoryToken,
		useValue: Like,
	},
];
