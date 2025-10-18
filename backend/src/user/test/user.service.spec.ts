import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import {
	BadRequestException,
	ConflictException,
	NotFoundException,
} from '@nestjs/common';
import {
	usersRepositoryToken,
	postsRepositoryToken,
	followsRepositoryToken,
} from 'src/constants';

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
	let postsRepository: {
		findAll: jest.Mock;
	};

	beforeEach(async () => {
		usersRepository = {
			create: jest.fn(),
			findOne: jest.fn(),
			update: jest.fn(),
			increment: jest.fn(),
			decrement: jest.fn(),
			findAll: jest.fn(),
		};
		postsRepository = {
			findAll: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{ provide: usersRepositoryToken, useValue: usersRepository },
				{ provide: postsRepositoryToken, useValue: postsRepository },
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
		it('should return posts if found', async () => {
			const posts = [{ id: 'p1' }, { id: 'p2' }];
			postsRepository.findAll.mockResolvedValue(posts);
			await expect(service.getPostByUser('1')).resolves.toEqual(posts);
		});

		it('should throw NotFoundException if no posts found', async () => {
			postsRepository.findAll.mockResolvedValue([]);
			await expect(service.getPostByUser('1')).rejects.toThrow(
				NotFoundException,
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
