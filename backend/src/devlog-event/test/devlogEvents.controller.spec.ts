import { Test, TestingModule } from '@nestjs/testing';
import { DevlogEventsController } from '../devlog-event.controller';
import { DevlogEventsService } from '../devlog-event.service';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { createDevlogEventDto } from '../dtos/devlogEvent.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BadRequestException } from '@nestjs/common';

interface TestRequest extends AuthRequest {
	params: { postId: string };
}

describe('DevlogEventsController', () => {
	let controller: DevlogEventsController;
	let service: DevlogEventsService;

	const mockDevlogEventsService = {
		findDevlogEventsByTagAndCategory: jest.fn(),
		createDevlogEvent: jest.fn(),
		findDevlogEvent: jest.fn(),
		findDevlogEventSlug: jest.fn(),
		updateDevlogEvent: jest.fn(),
		deleteDevlogEvent: jest.fn(),
	};

	const mockJwtService = {
		verify: jest.fn().mockReturnValue({ userId: 'user-id' }),
	};

	const mockAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DevlogEventsController],
			providers: [
				{
					provide: DevlogEventsService,
					useValue: mockDevlogEventsService,
				},
				{ provide: JwtService, useValue: mockJwtService },
			],
		})
			.overrideGuard(AuthGuard)
			.useValue(mockAuthGuard)
			.compile();

		controller = module.get<DevlogEventsController>(DevlogEventsController);
		service = module.get<DevlogEventsService>(DevlogEventsService);
	});

	it('should return filtered devlogEvents by tags and categories', async () => {
		const query = { tag: ['react'], category: 'frontend' };
		mockDevlogEventsService.findDevlogEventsByTagAndCategory.mockResolvedValue(
			['filteredPost'],
		);
		await expect(
			controller.findDevlogEventsByTagAndCategory(
				query.tag,
				query.category,
			),
		).resolves.toEqual(['filteredPost']);
		expect(
			mockDevlogEventsService.findDevlogEventsByTagAndCategory,
		).toHaveBeenCalledWith(query.tag, query.category);
	});

	it('should create a post', async () => {
		const req = { user: { userId: '123' } } as AuthRequest;
		const dto: createDevlogEventDto = {
			summary: 'summary',
			content: 'c',
			description: '',
		};
		mockDevlogEventsService.createDevlogEvent.mockResolvedValue(dto);
		await expect(controller.createPost(req, dto)).resolves.toEqual(dto);
	});

	it('should return a post by id', async () => {
		const req = { params: { id: '1' } } as any;
		mockDevlogEventsService.findDevlogEvent.mockResolvedValue({ id: '1' });
		await expect(controller.findPost(req)).resolves.toEqual({ id: '1' });
	});

	it('should return post by slug', async () => {
		mockDevlogEventsService.findDevlogEventSlug.mockResolvedValue({
			slug: 'slug',
		});
		await expect(controller.findPostSlug('slug')).resolves.toEqual({
			slug: 'slug',
		});
	});

	it('should update a post', async () => {
		const req = { user: { userId: '1' } } as AuthRequest;
		const dto = {
			summary: 'summary',
			content: 'c',
			description: '',
		};
		mockDevlogEventsService.updateDevlogEvent.mockResolvedValue({
			id: '1',
			...dto,
		});
		await expect(
			controller.updateDevlogEvent('1', req, dto),
		).resolves.toEqual({
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
			controller.deleteDevlogEvent(req.params.postId, req),
		).rejects.toThrow(BadRequestException);
	});

	it('should delete a post', async () => {
		const req = {
			params: { postId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' },
			user: { userId: '1' },
		} as TestRequest;

		mockDevlogEventsService.deleteDevlogEvent.mockResolvedValue({
			id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
			userId: '1',
		});
		await expect(
			controller.deleteDevlogEvent(req.params.postId, req),
		).resolves.toEqual({
			id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
			userId: '1',
		});
	});
});
