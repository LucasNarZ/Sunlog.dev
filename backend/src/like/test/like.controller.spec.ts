import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from '../like.controller';
import { LikeService } from '../like.service';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { LikePostDto } from '../dtos/likeDevlogEvent.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BadRequestException } from '@nestjs/common';

interface TestRequest extends AuthRequest {
	params: { postId: string };
}

describe('DevlogEventsController', () => {
	let controller: LikeController;
	let service: LikeService;

	const mockLikeService = {
		likePost: jest.fn(),
		unlikePost: jest.fn(),
		getLikePost: jest.fn(),
	};

	const mockJwtService = {
		verify: jest.fn().mockReturnValue({ userId: 'user-id' }),
	};

	const mockAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LikeController],
			providers: [
				{ provide: LikeService, useValue: mockLikeService },
				{ provide: JwtService, useValue: mockJwtService },
			],
		})
			.overrideGuard(AuthGuard)
			.useValue(mockAuthGuard)
			.compile();

		controller = module.get<LikeController>(LikeController);
		service = module.get<LikeService>(LikeService);
	});

	it('should like a post', async () => {
		const req = { user: { userId: 'u1' } } as AuthRequest;
		const dto: LikePostDto = { likedId: 'p1' };
		mockLikeService.likePost.mockResolvedValue({
			message: 'Liked successfully',
		});
		await expect(controller.followUser(req, dto)).resolves.toEqual({
			message: 'Liked successfully',
		});
	});

	it('should unlike a post', async () => {
		const req = { user: { userId: 'u1' } } as AuthRequest;
		const dto: LikePostDto = { likedId: 'p1' };
		mockLikeService.unlikePost.mockResolvedValue({
			message: 'Unliked successfully',
		});
		await expect(controller.unlikePost(req, dto)).resolves.toEqual({
			message: 'Unliked successfully',
		});
	});

	it('should return true if post is liked', async () => {
		const req = {
			user: { userId: '584829f9-e209-4d5d-9cd5-68aca9c5498e' },
		} as AuthRequest;
		mockLikeService.getLikePost.mockResolvedValue(true);
		await expect(controller.getLikePost(req, 'p1')).resolves.toBe(true);
	});
});
