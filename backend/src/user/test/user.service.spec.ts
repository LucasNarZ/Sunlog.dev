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
	let followsRepository: {
		findOne: jest.Mock;
		create: jest.Mock;
		destroy: jest.Mock;
	};

	beforeEach(async () => {
		usersRepository = {
			create: jest.fn(),
			findOne: jest.fn(),
			update: jest.fn(),
			increment: jest.fn(),
			decrement: jest.fn(),
			findAll: jest.fn()
		};
		postsRepository = {
			findAll: jest.fn(),
		};
		followsRepository = {
			findOne: jest.fn(),
			create: jest.fn(),
			destroy: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{ provide: usersRepositoryToken, useValue: usersRepository },
				{ provide: postsRepositoryToken, useValue: postsRepository },
				{
					provide: followsRepositoryToken,
					useValue: followsRepository,
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

	describe('followUser', () => {
		it('should throw if followerId equals followedId', async () => {
			await expect(service.followUser('1', '1')).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw ConflictException if already following', async () => {
			followsRepository.findOne.mockResolvedValue({ id: 'relation1' });
			await expect(service.followUser('1', '2')).rejects.toThrow(
				ConflictException,
			);
		});

		it('should increment followers and create follow relation', async () => {
			followsRepository.findOne.mockResolvedValue(null);
			usersRepository.increment.mockResolvedValue(null);
			followsRepository.create.mockResolvedValue(null);

			await expect(service.followUser('1', '2')).resolves.toEqual({
				message: 'Followed successfully',
			});
			expect(usersRepository.increment).toHaveBeenCalledWith(
				'followersNumber',
				{ where: { id: '2' } },
			);
			expect(followsRepository.create).toHaveBeenCalledWith({
				followerId: '1',
				followedId: '2',
			});
		});
	});

	describe('unfollowUser', () => {
		it('should throw if followerId equals followedId', async () => {
			await expect(service.unfollowUser('1', '1')).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw NotFoundException if no relation found', async () => {
			followsRepository.findOne.mockResolvedValue(null);
			await expect(service.unfollowUser('1', '2')).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should decrement followers and destroy follow relation', async () => {
			followsRepository.findOne.mockResolvedValue({ id: 'rel1' });
			usersRepository.decrement.mockResolvedValue(null);
			followsRepository.destroy.mockResolvedValue(null);

			await expect(service.unfollowUser('1', '2')).resolves.toEqual({
				message: 'Unfollowed successfully',
			});
			expect(usersRepository.decrement).toHaveBeenCalledWith(
				'followersNumber',
				{ where: { id: '2' } },
			);
			expect(followsRepository.destroy).toHaveBeenCalledWith({
				where: { followerId: '1', followedId: '2' },
			});
		});
	});

	describe('getFollowUser', () => {
		it('should return true if relation exists', async () => {
			followsRepository.findOne.mockResolvedValue({ id: 'rel1' });
			await expect(service.getFollowUser('1', '2')).resolves.toBe(true);
		});

		it('should return false if relation does not exist', async () => {
			followsRepository.findOne.mockResolvedValue(null);
			await expect(service.getFollowUser('1', '2')).resolves.toBe(false);
		});
	});

	describe("getTrendingUsers", () => {
		it('shoud return trendingUsers', async () => {
			usersRepository.findAll.mockResolvedValue(
				[
					{
						"id": "1",
						"name": "lucas"
					},
					{
						"id": "2",
						"name": "lucas"
					},
					{
						"id": "3",
						"name": "lucas"
					}
				]
			)
			await expect(service.getTrendingUsers()).resolves.toStrictEqual([
					{
						"id": "1",
						"name": "lucas"
					},
					{
						"id": "2",
						"name": "lucas"
					},
					{
						"id": "3",
						"name": "lucas"
					}
				])
		})
	})
});
