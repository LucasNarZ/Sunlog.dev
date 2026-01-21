import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../project.service';
import {
	projectRepositoryToken,
	devlogEventRepositoryToken,
} from 'src/constants';
import {
	NotFoundException,
	UnauthorizedException,
	ConflictException,
} from '@nestjs/common';

describe('ProjectService', () => {
	let service: ProjectService;
	let projectRepository: {
		create: jest.Mock;
		findOne: jest.Mock;
		findByPk: jest.Mock;
		findAll: jest.Mock;
		update: jest.Mock;
		destroy: jest.Mock;
	};
	let devlogEventRepository: {
		findAll: jest.Mock;
	};

	beforeEach(async () => {
		projectRepository = {
			create: jest.fn(),
			findOne: jest.fn(),
			findByPk: jest.fn(),
			findAll: jest.fn(),
			update: jest.fn(),
			destroy: jest.fn(),
		};

		devlogEventRepository = {
			findAll: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProjectService,
				{
					provide: projectRepositoryToken,
					useValue: projectRepository,
				},
				{
					provide: devlogEventRepositoryToken,
					useValue: devlogEventRepository,
				},
			],
		}).compile();

		service = module.get<ProjectService>(ProjectService);
	});

	describe('createProject', () => {
		it('should create a project when it does not exist', async () => {
			const userId = 'user1';
			const dto = {
				name: 'My Project',
				description: 'Project description',
			};
			const createdProject = { id: 'p1', ...dto, userId };

			projectRepository.findOne.mockResolvedValue(null);
			projectRepository.create.mockResolvedValue(createdProject);

			await expect(service.createProject(userId, dto)).resolves.toEqual(
				createdProject,
			);
			expect(projectRepository.findOne).toHaveBeenCalledWith({
				where: { name: dto.name, userId },
				attributes: ['id'],
			});
			expect(projectRepository.create).toHaveBeenCalledWith({
				...dto,
				userId,
			});
		});

		it('should throw ConflictException when project already exists', async () => {
			const userId = 'user1';
			const dto = { name: 'My Project' };
			const existingProject = { id: 'p1' };

			projectRepository.findOne.mockResolvedValue(existingProject);

			await expect(service.createProject(userId, dto)).rejects.toThrow(
				ConflictException,
			);
			expect(projectRepository.create).not.toHaveBeenCalled();
		});
	});

	describe('findProject', () => {
		it('should return project by id', async () => {
			const project = { id: 'p1', name: 'Project' };
			projectRepository.findByPk.mockResolvedValue(project);

			await expect(service.findProject('p1')).resolves.toEqual(project);
			expect(projectRepository.findByPk).toHaveBeenCalledWith('p1');
		});
	});

	describe('findProjectByName', () => {
		it('should return project by username and project name', async () => {
			const username = 'john';
			const projectName = 'MyProject';
			const project = {
				id: 'p1',
				name: projectName,
				description: 'desc',
				readme: 'readme',
			};

			projectRepository.findOne.mockResolvedValue(project);

			await expect(
				service.findProjectByName(username, projectName),
			).resolves.toEqual(project);
			expect(projectRepository.findOne).toHaveBeenCalledWith({
				where: { name: projectName },
				attributes: ['name', 'id', 'description', 'readme'],
				include: [
					{
						model: expect.anything(),
						attributes: [['name', 'username']],
						required: true,
						where: { name: username },
					},
				],
			});
		});
	});

	describe('findAllProjects', () => {
		it('should return all projects with user info', async () => {
			const projects = [
				{ id: 'p1', name: 'Project 1' },
				{ id: 'p2', name: 'Project 2' },
			];

			projectRepository.findAll.mockResolvedValue(projects);

			await expect(service.findAllProjects()).resolves.toEqual(projects);
			expect(projectRepository.findAll).toHaveBeenCalledWith({
				include: [
					{
						model: expect.anything(),
						required: true,
						attributes: [['name', 'username']],
					},
				],
			});
		});
	});

	describe('updateProject', () => {
		it('should update project when user is the creator', async () => {
			const id = 'p1';
			const userId = 'user1';
			const data = { name: 'Updated Project' };
			const project = { userId: 'user1' };
			const updatedProject = { id, ...data, userId };

			projectRepository.findOne.mockResolvedValue(project);
			projectRepository.update.mockResolvedValue([1]);
			projectRepository.findByPk.mockResolvedValue(updatedProject);

			await expect(
				service.updateProject(id, userId, data),
			).resolves.toEqual(updatedProject);
			expect(projectRepository.update).toHaveBeenCalledWith(data, {
				where: { id },
			});
			expect(projectRepository.findByPk).toHaveBeenCalledWith(id);
		});

		it('should throw NotFoundException when project not found', async () => {
			projectRepository.findOne.mockResolvedValue(null);

			await expect(
				service.updateProject('p1', 'user1', {}),
			).rejects.toThrow(NotFoundException);
			expect(projectRepository.update).not.toHaveBeenCalled();
		});

		it('should throw UnauthorizedException when user is not the creator', async () => {
			const project = { userId: 'user2' };
			projectRepository.findOne.mockResolvedValue(project);

			await expect(
				service.updateProject('p1', 'user1', {}),
			).rejects.toThrow(UnauthorizedException);
			expect(projectRepository.update).not.toHaveBeenCalled();
		});
	});

	describe('deleteProject', () => {
		it('should delete project when user is the creator', async () => {
			const id = 'p1';
			const userId = 'user1';
			const project = { userId: 'user1' };

			projectRepository.findOne.mockResolvedValue(project);
			projectRepository.destroy.mockResolvedValue(1);

			await expect(service.deleteProject(id, userId)).resolves.toEqual(1);
			expect(projectRepository.destroy).toHaveBeenCalledWith({
				where: { id },
			});
		});

		it('should throw NotFoundException when project not found', async () => {
			projectRepository.findOne.mockResolvedValue(null);

			await expect(service.deleteProject('p1', 'user1')).rejects.toThrow(
				NotFoundException,
			);
			expect(projectRepository.destroy).not.toHaveBeenCalled();
		});

		it('should throw UnauthorizedException when user is not the creator', async () => {
			const project = { userId: 'user2' };
			projectRepository.findOne.mockResolvedValue(project);

			await expect(service.deleteProject('p1', 'user1')).rejects.toThrow(
				UnauthorizedException,
			);
			expect(projectRepository.destroy).not.toHaveBeenCalled();
		});
	});

	describe('getProjectDevlogs', () => {
		it('should return devlogs for a project', async () => {
			const projectId = 'p1';
			const devlogs = [
				{ id: 'd1', projectId },
				{ id: 'd2', projectId },
			];

			devlogEventRepository.findAll.mockResolvedValue(devlogs);

			await expect(service.getProjectDevlogs(projectId)).resolves.toEqual(
				devlogs,
			);
			expect(devlogEventRepository.findAll).toHaveBeenCalledWith({
				where: { projectId },
			});
		});
	});
});
