import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import {
	usersRepositoryToken,
	devlogEventRepositoryToken,
	projectRepositoryToken,
} from 'src/constants';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
	let service: UsersService;
	let usersRepository: {
		create: jest.Mock;
		findOne: jest.Mock;
		update: jest.Mock;
		increment: jest.Mock;
		decrement: jest.Mock;
		findAll: jest.Mock;
	};
	let devlogEventRepository: {
		findAll: jest.Mock;
	};

	let projectRepository = {};

	beforeEach(async () => {
		usersRepository = {
			create: jest.fn(),
			findOne: jest.fn(),
			update: jest.fn(),
			increment: jest.fn(),
			decrement: jest.fn(),
			findAll: jest.fn(),
		};
		devlogEventRepository = {
			findAll: jest.fn(),
		};
		projectRepository = {};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{ provide: usersRepositoryToken, useValue: usersRepository },
				{
					provide: devlogEventRepositoryToken,
					useValue: devlogEventRepository,
				},
				{
					provide: projectRepositoryToken,
					useValue: projectRepository,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	describe('createUser', () => {
		it('should call usersRepository.create with correct params', async () => {
			const dto = {
				name: 'John',
				email: 'john@example.com',
				password: 'pass',
			};
			usersRepository.create.mockResolvedValue(dto);
			await expect(service.createUser(dto)).resolves.toEqual(dto);
			expect(usersRepository.create).toHaveBeenCalledWith(dto);
		});
	});

	describe('getUserByEmail', () => {
		it('should call usersRepository.findOne with correct email', async () => {
			const user = { id: '1', email: 'a@b.com' };
			usersRepository.findOne.mockResolvedValue(user);
			await expect(service.getUserByEmail('a@b.com')).resolves.toEqual(
				user,
			);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email: 'a@b.com' },
			});
		});
	});

	describe('findUserPublic', () => {
		it('should return user when found', async () => {
			const user = { id: '1', name: 'John' };
			usersRepository.findOne.mockResolvedValue(user);
			await expect(service.findUserPublic('1')).resolves.toEqual(user);
		});

		it('should throw NotFoundException when user not found', async () => {
			usersRepository.findOne.mockResolvedValue(null);
			await expect(service.findUserPublic('1')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('getPostByUser', () => {
		it('should return devlogEvents if found', async () => {
			const devlogEvents = [{ id: 'p1' }, { id: 'p2' }];
			devlogEventRepository.findAll.mockResolvedValue(devlogEvents);
			await expect(service.getPostByUser('1')).resolves.toEqual(
				devlogEvents,
			);
		});
	});

	describe('getTrendingUsers', () => {
		it('shoud return trendingUsers', async () => {
			usersRepository.findAll.mockResolvedValue([
				{
					id: '1',
					name: 'lucas',
				},
				{
					id: '2',
					name: 'lucas',
				},
				{
					id: '3',
					name: 'lucas',
				},
			]);
			await expect(service.getTrendingUsers()).resolves.toStrictEqual([
				{
					id: '1',
					name: 'lucas',
				},
				{
					id: '2',
					name: 'lucas',
				},
				{
					id: '3',
					name: 'lucas',
				},
			]);
		});
	});
});
