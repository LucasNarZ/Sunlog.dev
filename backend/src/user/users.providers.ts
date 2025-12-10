import { devlogEventRepositoryToken, projectRepositoryToken, usersRepositoryToken } from 'src/constants';
import { User } from './user.entity';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';
import { Project } from 'src/project/project.entity';

export const usersProviders = [
	{
		provide: usersRepositoryToken,
		useValue: User,
	},
	{
		provide: devlogEventRepositoryToken,
		useValue: DevlogEvent,
	},
	{
		provide: projectRepositoryToken,
		useValue: Project
	}
];
