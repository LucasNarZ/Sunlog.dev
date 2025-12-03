import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from '../like.service';
import { devlogEventRepositoryToken, likesRepositoryToken } from 'src/constants';
import { ConflictException } from '@nestjs/common';

describe('LikeService', () => {
	let service: LikeService;
	let devlogEventRepository: {
		increment: jest.Mock;
		decrement: jest.Mock;
	};
	let likesRepository: {
		findOne: jest.Mock;
		create: jest.Mock;
		destroy: jest.Mock;
	};

	beforeEach(async () => {
		devlogEventRepository = {
			increment: jest.fn(),
			decrement: jest.fn(),
		};
		likesRepository = {
			findOne: jest.fn(),
			create: jest.fn(),
			destroy: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LikeService,
				{ provide: devlogEventRepositoryToken, useValue: devlogEventRepository },
				{ provide: likesRepositoryToken, useValue: likesRepository },
			],
		}).compile();

		service = module.get<LikeService>(LikeService);
	});

	describe('likePost', () => {
		it('should throw if already liked', async () => {
			likesRepository.findOne.mockResolvedValue({});
			await expect(service.likePost('uid', 'pid')).rejects.toThrow(
				ConflictException,
			);
		});

		it('should like post and return message', async () => {
			likesRepository.findOne.mockResolvedValue(null);
			devlogEventRepository.increment.mockResolvedValue(null);
			likesRepository.create.mockResolvedValue(null);

			await expect(service.likePost('uid', 'pid')).resolves.toEqual({
				message: 'Liked successfully',
			});
		});
	});

	describe('unlikePost', () => {
		it('should throw if not liked', async () => {
			likesRepository.findOne.mockResolvedValue(null);
			await expect(service.unlikePost('uid', 'pid')).rejects.toThrow(
				ConflictException,
			);
		});

		it('should unlike post and return message', async () => {
			likesRepository.findOne.mockResolvedValue({});
			devlogEventRepository.decrement.mockResolvedValue(null);
			likesRepository.destroy.mockResolvedValue(null);

			await expect(service.unlikePost('uid', 'pid')).resolves.toEqual({
				message: 'Unliked successfully',
			});
		});
	});

	describe('getLikePost', () => {
		it('should return true if liked', async () => {
			likesRepository.findOne.mockResolvedValue({});
			await expect(service.getLikePost('uid', 'pid')).resolves.toBe(true);
		});

		it('should return false if not liked', async () => {
			likesRepository.findOne.mockResolvedValue(null);
			await expect(service.getLikePost('uid', 'pid')).resolves.toBe(
				false,
			);
		});
	});
});
