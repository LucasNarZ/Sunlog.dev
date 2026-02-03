import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from '../project.controller';
import { ProjectService } from '../project.service';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { CreateProjectDto } from '../dtos/createProject.dto';
import { LoggerService } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';

describe('ProjectController', () => {
	let controller: ProjectController;
	let projectService: {
		createProject: jest.Mock;
		findProject: jest.Mock;
		findProjectByName: jest.Mock;
		findAllProjects: jest.Mock;
		updateProject: jest.Mock;
		deleteProject: jest.Mock;
		getProjectDevlogs: jest.Mock;
	};
	let logger: {
		log: jest.Mock;
	};

	beforeEach(async () => {
		projectService = {
			createProject: jest.fn(),
			findProject: jest.fn(),
			findProjectByName: jest.fn(),
			findAllProjects: jest.fn(),
			updateProject: jest.fn(),
			deleteProject: jest.fn(),
			getProjectDevlogs: jest.fn(),
		};

		logger = {
			log: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProjectController],
			providers: [
				{
					provide: ProjectService,
					useValue: projectService,
				},
			],
		})
			.overrideGuard(AuthGuard)
			.useValue({ canActivate: jest.fn(() => true) })
			.compile();

		controller = module.get<ProjectController>(ProjectController);
	});

	describe('createProject', () => {
		it('should call projectService.createProject with userId and dto', async () => {
			const userId = 'user1';
			const dto: CreateProjectDto = {
				name: 'My Project',
				description: 'Project description',
			};
			const req = {
				user: { userId },
			} as AuthRequest;
			const createdProject = { id: 'p1', ...dto, userId };

			projectService.createProject.mockResolvedValue(createdProject);

			await expect(controller.createProject(req, dto)).resolves.toEqual(
				createdProject,
			);
			expect(projectService.createProject).toHaveBeenCalledWith(
				userId,
				dto,
			);
		});
	});

	describe('findProject', () => {
		it('should call projectService.findProject with id', async () => {
			const id = 'p1';
			const project = { id, name: 'Project' };

			projectService.findProject.mockResolvedValue(project);

			await expect(controller.findProject(id)).resolves.toEqual(project);
			expect(projectService.findProject).toHaveBeenCalledWith(id);
		});
	});

	describe('getProjectDevlogs', () => {
		it('should call projectService.getProjectDevlogs with id', async () => {
			const id = 'p1';
			const devlogs = [
				{ id: 'd1', projectId: id },
				{ id: 'd2', projectId: id },
			];

			projectService.getProjectDevlogs.mockResolvedValue(devlogs);

			await expect(controller.getProjectDevlogs(id)).resolves.toEqual(
				devlogs,
			);
			expect(projectService.getProjectDevlogs).toHaveBeenCalledWith(id);
		});
	});

	describe('findProjectByName', () => {
		it('should call projectService.findProjectByName with username and projectName', async () => {
			const username = 'john';
			const projectName = 'MyProject';
			const project = {
				id: 'p1',
				name: projectName,
				description: 'desc',
			};

			projectService.findProjectByName.mockResolvedValue(project);

			await expect(
				controller.findProjectByName(username, projectName),
			).resolves.toEqual(project);
			expect(projectService.findProjectByName).toHaveBeenCalledWith(
				username,
				projectName,
			);
		});
	});

	describe('findAllProjects', () => {
		it('should call projectService.findAllProjects and log message', async () => {
			const projects = [
				{ id: 'p1', name: 'Project 1' },
				{ id: 'p2', name: 'Project 2' },
			];

			projectService.findAllProjects.mockResolvedValue(projects);

			await expect(controller.findAllProjects()).resolves.toEqual(
				projects,
			);
			expect(projectService.findAllProjects).toHaveBeenCalled();
		});
	});

	describe('update', () => {
		it('should call projectService.updateProject with id, userId and data', async () => {
			const userId = 'user1';
			const id = 'p1';
			const data = { name: 'Updated Project' };
			const req = {
				user: { userId },
			} as AuthRequest;
			const updatedProject = { id, ...data, userId };

			projectService.updateProject.mockResolvedValue(updatedProject);

			await expect(controller.update(req, id, data)).resolves.toEqual(
				updatedProject,
			);
			expect(projectService.updateProject).toHaveBeenCalledWith(
				id,
				userId,
				data,
			);
		});
	});

	describe('deleteProject', () => {
		it('should call projectService.deleteProject with id and userId', async () => {
			const userId = 'user1';
			const id = 'p1';
			const req = {
				user: { userId },
			} as AuthRequest;

			projectService.deleteProject.mockResolvedValue(1);

			await expect(controller.deleteProject(req, id)).resolves.toEqual(1);
			expect(projectService.deleteProject).toHaveBeenCalledWith(
				id,
				userId,
			);
		});
	});
});
