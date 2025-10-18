import { Test, TestingModule } from '@nestjs/testing';
import { FollowService } from '../follow.service';
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

describe('FollowService', () => {
	let service: FollowService;
	let usersRepository: {
		increment: jest.Mock;
		decrement: jest.Mock;
	};
	let followsRepository: {
		findOne: jest.Mock;
		create: jest.Mock;
		destroy: jest.Mock;
	};

	beforeEach(async () => {
		usersRepository = {
			increment: jest.fn(),
			decrement: jest.fn(),
		};
		followsRepository = {
			findOne: jest.fn(),
			create: jest.fn(),
			destroy: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FollowService,
				{ provide: usersRepositoryToken, useValue: usersRepository },
				{
					provide: followsRepositoryToken,
					useValue: followsRepository,
				},
			],
		}).compile();

		service = module.get<FollowService>(FollowService);
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
});
