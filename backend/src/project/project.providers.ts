import { projectRepositoryToken } from 'src/constants';
import { Project } from './project.entity';

export const projectProviders = [
    {
        provide: projectRepositoryToken,
        useValue: Project
    }
];
