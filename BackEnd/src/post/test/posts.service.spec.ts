import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { postsRepositoryToken, likesRepositoryToken } from 'src/constants';
import {
	UnauthorizedException,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { Op } from 'sequelize';

describe('PostsService', () => {
	let service: PostsService;
	let postsRepository: {
		create: jest.Mock;
		findOne: jest.Mock;
		findAll: jest.Mock;
		update: jest.Mock;
		increment: jest.Mock;
		decrement: jest.Mock;
	};
	let likesRepository: {
		findOne: jest.Mock;
		create: jest.Mock;
		destroy: jest.Mock;
	};

	beforeEach(async () => {
		postsRepository = {
			create: jest.fn(),
			findOne: jest.fn(),
			findAll: jest.fn(),
			update: jest.fn(),
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
				PostsService,
				{ provide: postsRepositoryToken, useValue: postsRepository },
				{ provide: likesRepositoryToken, useValue: likesRepository },
			],
		}).compile();

		service = module.get<PostsService>(PostsService);
	});

	describe('createPost', () => {
		it('should create a post', async () => {
			const dto = {
				title: 't',
				content: 'c',
				authorId: '1',
				tags: [],
				categorys: [],
				previewImgUrl: '',
				description: '',
				slug: 'test',
			};
			postsRepository.create.mockResolvedValue(dto);
			await expect(service.createPost('1', dto)).resolves.toEqual(dto);
		});
	});

	describe('findPostSlug', () => {
		it('should return post if found', async () => {
			const post = { id: '1' };
			postsRepository.findOne.mockResolvedValue(post);
			await expect(service.findPostSlug('slug')).resolves.toEqual(post);
		});

		it('should throw if post not found', async () => {
			postsRepository.findOne.mockResolvedValue(null);
			await expect(service.findPostSlug('slug')).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('updatePost', () => {
		const validPostData = {
			title: 'New Title',
			description: 'New Description',
			content: 'New Content',
		};

		it('should throw if post not found', async () => {
			postsRepository.findOne.mockResolvedValue(null);
			await expect(
				service.updatePost('pid', 'uid', validPostData),
			).rejects.toThrow(NotFoundException);
		});

		it('should throw if user is not author', async () => {
			postsRepository.findOne.mockResolvedValue({ userId: 'other' });
			await expect(
				service.updatePost('pid', 'uid', validPostData),
			).rejects.toThrow(UnauthorizedException);
		});

		it('should update post if user is author', async () => {
			postsRepository.findOne.mockResolvedValue({ userId: 'user-id' });
			postsRepository.update.mockResolvedValue({});

			await expect(
				service.updatePost('post-id', 'user-id', validPostData),
			).resolves.toEqual({});
		});
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
			postsRepository.increment.mockResolvedValue(null);
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
			postsRepository.decrement.mockResolvedValue(null);
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

	describe('findPostsByTagAndCategory', () => {
		it('should find posts by array of tags and categories', async () => {
			const mockPosts = ['post1', 'post2'];
			postsRepository.findAll.mockResolvedValue(mockPosts);

			const result = await service.findPostsByTagAndCategory(['react'], ['frontend']);

			expect(postsRepository.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [
						{ tags: { [Op.overlap]: ['react'] } },
						{ categorys: { [Op.overlap]: ['frontend'] } }
					]
				}
			});
			expect(result).toEqual(mockPosts);
		});

		it('should convert single string to array and return posts', async () => {
			const mockPosts = ['post'];
			postsRepository.findAll.mockResolvedValue(mockPosts);

			const result = await service.findPostsByTagAndCategory('node' as any, 'backend' as any);

			expect(postsRepository.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [
						{ tags: { [Op.overlap]: ['node'] } },
						{ categorys: { [Op.overlap]: ['backend'] } }
					]
				}
			});
			expect(result).toEqual(mockPosts);
		});

		it('should return all posts if both filters are undefined', async () => {
			const mockPosts = ['allPosts'];
			postsRepository.findAll.mockResolvedValue(mockPosts);

			const result = await service.findPostsByTagAndCategory(undefined, undefined);

			expect(postsRepository.findAll).toHaveBeenCalledWith({ where: {} });
			expect(result).toEqual(mockPosts);
		});

		it('should search only by tags if categories are undefined', async () => {
			postsRepository.findAll.mockResolvedValue(['tagOnly']);

			await service.findPostsByTagAndCategory(['react'], undefined);

			expect(postsRepository.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [{ tags: { [Op.overlap]: ['react'] } }]
				}
			});
		});

		it('should search only by categories if tags are undefined', async () => {
			postsRepository.findAll.mockResolvedValue(['categoryOnly']);

			await service.findPostsByTagAndCategory(undefined, ['design']);

			expect(postsRepository.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [{ categorys: { [Op.overlap]: ['design'] } }]
				}
			});
		});
	});
});
