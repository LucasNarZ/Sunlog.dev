import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	Put,
	Delete,
	Req,
	UseGuards,
	LoggerService,
	Inject,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateProjectDto } from './dtos/createProject.dto';

@Controller('projects')
export class ProjectController {
	constructor(
		private readonly projectService: ProjectService, 
		@Inject('LOGGER')
		private readonly logger: LoggerService
	) {}

	@UseGuards(AuthGuard)
	@Post()
	async createProject(
		@Req() req: AuthRequest,
		@Body() data: CreateProjectDto,
	) {
		const userId = req.user.userId;
		return await this.projectService.createProject(userId, data);
	}

	@Get(':id')
	async findProject(@Param('id') id: string) {
		return await this.projectService.findProject(id);
	}

	@Get(':id/devlog-events')
	async getProjectDevlogs(@Param('id') id: string) {
		return await this.projectService.getProjectDevlogs(id);
	}

	@Get(':username/:projectName')
	async findProjectByName(
		@Param('username') username: string,
		@Param('projectName') projectName: string,
	) {
		return await this.projectService.findProjectByName(
			username,
			projectName,
		);
	}

	@Get()
	async findAllProjects() {
		this.logger.log("Good log!!!!")
		return await this.projectService.findAllProjects();
	}

	@UseGuards(AuthGuard)
	@Put(':id')
	async update(
		@Req() req: AuthRequest,
		@Param('id') id: string,
		@Body() data: any,
	) {
		const userId = req.user.userId;
		return await this.projectService.updateProject(id, userId, data);
	}

	@UseGuards(AuthGuard)
	@Delete(':id')
	async deleteProject(@Req() req: AuthRequest, @Param('id') id: string) {
		const userId = req.user.userId;
		return await this.projectService.deleteProject(id, userId);
	}
}
