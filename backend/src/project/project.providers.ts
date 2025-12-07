import {
	devlogEventRepositoryToken,
	projectRepositoryToken,
} from 'src/constants';
import { Project } from './project.entity';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';

export const projectProviders = [
	{
		provide: projectRepositoryToken,
		useValue: Project,
	},
	{
		provide: devlogEventRepositoryToken,
		useValue: DevlogEvent,
	},
];
