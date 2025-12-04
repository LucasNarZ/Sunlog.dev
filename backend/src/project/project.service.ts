import {
	Inject,
	Injectable,
	UnauthorizedException,
	NotFoundException,
} from '@nestjs/common';
import { Project } from './project.entity';
import {
	devlogEventRepositoryToken,
	projectRepositoryToken,
} from 'src/constants';
import { CreateProjectDto } from './dtos/createProject.dto';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';

@Injectable()
export class ProjectService {
	constructor(
		@Inject(projectRepositoryToken)
		private readonly projectRepository: typeof Project,
		@Inject(devlogEventRepositoryToken)
		private readonly devlogEventRepository: typeof DevlogEvent,
	) {}

	async createProject(userId: string, data: CreateProjectDto) {
		return this.projectRepository.create({
			...data,
			userId,
		});
	}

	async findProject(id: string) {
		return this.projectRepository.findByPk(id);
	}

	async findProjectsByUser(userId: string) {
		return this.projectRepository.findAll({ where: { userId } });
	}

	async findAllProjects() {
		return this.projectRepository.findAll();
	}

	async updateProject(id: string, userId: string, data: any) {
		const project = await this.projectRepository.findOne({
			where: {
				id,
			},
			attributes: ['userId'],
		});

		if (!project) {
			throw new NotFoundException('Project not found.');
		}

		if (userId !== project.userId) {
			throw new UnauthorizedException(
				'You are not the creator of the project',
			);
		}

		await this.projectRepository.update(data, { where: { id } });
		return this.projectRepository.findByPk(id);
	}

	async deleteProject(id: string, userId: string) {
		const project = await this.projectRepository.findOne({
			where: {
				id,
			},
			attributes: ['userId'],
		});

		if (!project) {
			throw new NotFoundException('Project not found.');
		}

		if (userId !== project.userId) {
			throw new UnauthorizedException(
				'You are not the creator of the project',
			);
		}

		return this.projectRepository.destroy({ where: { id } });
	}

	async getProjectDevlogs(projectId: string) {
		const devlogs = await this.devlogEventRepository.findAll({
			where: {
				projectId,
			},
		});

		return devlogs;
	}
}
