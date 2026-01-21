import {
	Inject,
	Injectable,
	UnauthorizedException,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { Project } from './project.entity';
import {
	devlogEventRepositoryToken,
	projectRepositoryToken,
} from 'src/constants';
import { CreateProjectDto } from './dtos/createProject.dto';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ProjectService {
	constructor(
		@Inject(projectRepositoryToken)
		private readonly projectRepository: typeof Project,
		@Inject(devlogEventRepositoryToken)
		private readonly devlogEventRepository: typeof DevlogEvent,
	) {}

	async createProject(userId: string, data: CreateProjectDto) {
		const project = await this.projectRepository.findOne({
			where: {
				name: data.name,
				userId,
			},
			attributes: ['id'],
		});

		if (project) {
			throw new ConflictException('Project already exists.');
		}

		return await this.projectRepository.create({
			...data,
			userId,
		});
	}

	async findProject(id: string) {
		return await this.projectRepository.findByPk(id);
	}

	async findProjectByName(username: string, projectName: string) {
		return await this.projectRepository.findOne({
			where: {
				name: projectName,
			},
			attributes: ['name', 'id', 'description', 'readme'],
			include: [
				{
					model: User,
					attributes: [['name', 'username']],
					required: true,
					where: {
						name: username,
					},
				},
			],
		});
	}

	async findAllProjects() {
		return await this.projectRepository.findAll({
			include: [
				{
					model: User,
					required: true,
					attributes: [['name', 'username']],
				},
			],
		});
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

		return await this.projectRepository.destroy({ where: { id } });
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
