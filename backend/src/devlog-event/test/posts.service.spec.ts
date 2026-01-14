import { Test, TestingModule } from '@nestjs/testing';
import { DevlogEventsService } from '../devlog-event.service';
import { devlogEventRepositoryToken } from 'src/constants';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { PostStatus } from '../postStatus.entity';

describe('DevlogEventsService', () => {
	let service: DevlogEventsService;
	let devlogEventRepository: {
		create: jest.Mock;
		findOne: jest.Mock;
		findAll: jest.Mock;
		update: jest.Mock;
		increment: jest.Mock;
		decrement: jest.Mock;
		destroy: jest.Mock;
	};

	beforeEach(async () => {
		devlogEventRepository = {
			create: jest.fn(),
			findOne: jest.fn(),
			findAll: jest.fn(),
			update: jest.fn(),
			increment: jest.fn(),
			decrement: jest.fn(),
			destroy: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DevlogEventsService,
				{
					provide: devlogEventRepositoryToken,
					useValue: devlogEventRepository,
				},
			],
		}).compile();

		service = module.get<DevlogEventsService>(DevlogEventsService);
	});

	describe('createPost', () => {
		it('should create a post', async () => {
			const dto = {
				title: 't',
				content: 'c',
				authorId: '1',
				tags: [],
				category: '',
				previewImgUrl: '',
				description: '',
				slug: 'test',
			};
			devlogEventRepository.create.mockResolvedValue(dto);
			await expect(service.createPost('1', dto)).resolves.toEqual(dto);
		});
	});

	describe('findPostSlug', () => {
		it('should return post if found', async () => {
			const post = { id: '1' };
			devlogEventRepository.findOne.mockResolvedValue(post);
			await expect(service.findPostSlug('slug')).resolves.toEqual(post);
		});

		it('should throw if post not found', async () => {
			devlogEventRepository.findOne.mockResolvedValue(null);
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
			category: '',
			slug: 'asdasds',
			authorId: 'hiuh',
		};

		it('should throw if post not found', async () => {
			devlogEventRepository.findOne.mockResolvedValue(null);
			await expect(
				service.updatePost('pid', 'uid', validPostData),
			).rejects.toThrow(NotFoundException);
		});

		it('should throw if user is not author', async () => {
			devlogEventRepository.findOne.mockResolvedValue({
				userId: 'other',
			});
			await expect(
				service.updatePost('pid', 'uid', validPostData),
			).rejects.toThrow(UnauthorizedException);
		});

		it('should update post if user is author', async () => {
			devlogEventRepository.findOne.mockResolvedValue({
				userId: 'user-id',
			});
			devlogEventRepository.update.mockResolvedValue({});

			await expect(
				service.updatePost('post-id', 'user-id', validPostData),
			).resolves.toEqual({});
		});
	});

	describe('deletePost', () => {
		it('should throw UnauthorizedException', async () => {
			devlogEventRepository.findOne.mockResolvedValue({ userId: '2' });
			await expect(service.deletePost('1', '1')).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('should throw NotFoundException for post not found', async () => {
			devlogEventRepository.findOne.mockResolvedValue(null);
			await expect(service.deletePost('1', '1')).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should delete a post successfully', async () => {
			devlogEventRepository.findOne.mockResolvedValue({ userId: '1' });
			devlogEventRepository.destroy.mockResolvedValue(1);
			await expect(service.deletePost('1', '1')).resolves.toEqual({
				userId: '1',
			});
		});
	});

	describe('findDevlogEventsByTagAndCategory', () => {
		it('should find devlogEvents by array of tags and categories', async () => {
			const mockDevlogEvents = ['post1', 'post2'];
			devlogEventRepository.findAll.mockResolvedValue(mockDevlogEvents);

			const result = await service.findDevlogEventsByTagAndCategory(
				['react'],
				'frontend',
			);

			expect(devlogEventRepository.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [
						{ tags: { [Op.overlap]: ['react'] } },
						{ category: 'frontend' },
					],
				},
				include: [
					{
						model: PostStatus,
						as: 'status',
						attributes: [],
						required: true,
						where: {
							name: 'APPROVED',
						},
					},
				],
			});
			expect(result).toEqual(mockDevlogEvents);
		});

		it('should convert single string to array and return devlogEvents', async () => {
			const mockDevlogEvents = ['post'];
			devlogEventRepository.findAll.mockResolvedValue(mockDevlogEvents);

			const result = await service.findDevlogEventsByTagAndCategory(
				'node',
				'backend',
			);

			expect(devlogEventRepository.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [
						{ tags: { [Op.overlap]: ['node'] } },
						{ category: 'backend' },
					],
				},
				include: [
					{
						model: PostStatus,
						as: 'status',
						attributes: [],
						required: true,
						where: {
							name: 'APPROVED',
						},
					},
				],
			});
			expect(result).toEqual(mockDevlogEvents);
		});

		it('should return all devlogEvents if both filters are undefined', async () => {
			const mockDevlogEvents = ['allDevlogEvents'];
			devlogEventRepository.findAll.mockResolvedValue(mockDevlogEvents);

			const result = await service.findDevlogEventsByTagAndCategory(
				undefined,
				undefined,
			);

			expect(devlogEventRepository.findAll).toHaveBeenCalledWith({
				where: {},
				include: [
					{
						model: PostStatus,
						as: 'status',
						attributes: [],
						required: true,
						where: {
							name: 'APPROVED',
						},
					},
				],
			});
			expect(result).toEqual(mockDevlogEvents);
		});

		it('should search only by tags if categories are undefined', async () => {
			devlogEventRepository.findAll.mockResolvedValue(['tagOnly']);

			await service.findDevlogEventsByTagAndCategory(
				['react'],
				undefined,
			);

			expect(devlogEventRepository.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [{ tags: { [Op.overlap]: ['react'] } }],
				},
				include: [
					{
						model: PostStatus,
						as: 'status',
						attributes: [],
						required: true,
						where: {
							name: 'APPROVED',
						},
					},
				],
			});
		});

		it('should search only by category if tags are undefined', async () => {
			devlogEventRepository.findAll.mockResolvedValue('categoryOnly');

			await service.findDevlogEventsByTagAndCategory(undefined, 'design');

			expect(devlogEventRepository.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [{ category: 'design' }],
				},
				include: [
					{
						model: PostStatus,
						as: 'status',
						attributes: [],
						required: true,
						where: {
							name: 'APPROVED',
						},
					},
				],
			});
		});
	});
});
