import {
	Inject,
	Injectable,
	UnauthorizedException,
	NotFoundException,
} from '@nestjs/common';
import { Project } from './project.entity';
import { projectRepositoryToken } from 'src/constants';
import { CreateProjectDto } from './dtos/createProject.dto';

@Injectable()
export class ProjectService {
	constructor(
		@Inject(projectRepositoryToken)
		private readonly projectRepository: typeof Project,
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
}
