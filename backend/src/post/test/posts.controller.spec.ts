import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { createPostDto } from '../dtos/post.dto';
import { EditPostDto } from '../dtos/editPost.dto';
import { LikePostDto } from '../../like/dtos/likePost.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BadRequestException } from '@nestjs/common';

interface TestRequest extends AuthRequest {
	params: { postId: string };
}

describe('PostsController', () => {
	let controller: PostsController;
	let service: PostsService;

	const mockPostsService = {
		findPostsByTagAndCategory: jest.fn(),
		createPost: jest.fn(),
		findPost: jest.fn(),
		findPostSlug: jest.fn(),
		updatePost: jest.fn(),
		deletePost: jest.fn(),
	};

	const mockJwtService = {
		verify: jest.fn().mockReturnValue({ userId: 'user-id' }),
	};

	const mockAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PostsController],
			providers: [
				{ provide: PostsService, useValue: mockPostsService },
				{ provide: JwtService, useValue: mockJwtService },
			],
		})
			.overrideGuard(AuthGuard)
			.useValue(mockAuthGuard)
			.compile();

		controller = module.get<PostsController>(PostsController);
		service = module.get<PostsService>(PostsService);
	});

	it('should return filtered posts by tags and categories', async () => {
		const query = { tag: ['react'], category: 'frontend' };
		mockPostsService.findPostsByTagAndCategory.mockResolvedValue([
			'filteredPost',
		]);
		await expect(
			controller.findPostsByTagAndCategory(query.tag, query.category),
		).resolves.toEqual(['filteredPost']);
		expect(mockPostsService.findPostsByTagAndCategory).toHaveBeenCalledWith(
			query.tag,
			query.category,
		);
	});

	it('should create a post', async () => {
		const req = { user: { userId: '123' } } as AuthRequest;
		const dto: createPostDto = {
			title: 't',
			content: 'c',
			authorId: '123',
			tags: [],
			category: '',
			description: '',
			slug: '',
			previewImgUrl: '',
		};
		mockPostsService.createPost.mockResolvedValue(dto);
		await expect(controller.createPost(req, dto)).resolves.toEqual(dto);
	});

	it('should return a post by id', async () => {
		const req = { params: { id: '1' } } as any;
		mockPostsService.findPost.mockResolvedValue({ id: '1' });
		await expect(controller.findPost(req)).resolves.toEqual({ id: '1' });
	});

	it('should return post by slug', async () => {
		mockPostsService.findPostSlug.mockResolvedValue({ slug: 'slug' });
		await expect(controller.findPostSlug('slug')).resolves.toEqual({
			slug: 'slug',
		});
	});

	it('should update a post', async () => {
		const req = { user: { userId: '1' } } as AuthRequest;
		const dto: EditPostDto = {
			title: 'new',
			description: 'desc',
			content: 'content',
		};
		mockPostsService.updatePost.mockResolvedValue({ id: '1', ...dto });
		await expect(controller.updatePost('1', req, dto)).resolves.toEqual({
			id: '1',
			...dto,
		});
	});

	it('should return 400 for post not UUID in delete route', async () => {
		const req = {
			params: { postId: '1' },
			user: { userId: '1' },
		} as TestRequest;
		await expect(
			controller.deletePost(req.params.postId, req),
		).rejects.toThrow(BadRequestException);
	});

	it('should delete a post', async () => {
		const req = {
			params: { postId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' },
			user: { userId: '1' },
		} as TestRequest;

		mockPostsService.deletePost.mockResolvedValue({
			id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
			userId: '1',
		});
		await expect(
			controller.deletePost(req.params.postId, req),
		).resolves.toEqual({
			id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
			userId: '1',
		});
	});
});
