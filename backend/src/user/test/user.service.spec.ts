import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { usersRepositoryToken } from 'src/constants';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
	let service: UsersService;
	let usersRepository: any;

	beforeEach(async () => {
		usersRepository = {
			create: jest.fn(),
			findOne: jest.fn(),
			update: jest.fn(),
			findAll: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{ provide: usersRepositoryToken, useValue: usersRepository },
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	describe('createUser', () => {
		it('should create a user with proper slug', async () => {
			const dto = {
				name: 'John Doe',
				email: 'a@b.com',
				password: 'pass',
			};
			const created = { ...dto, slug: 'john_doe' };
			usersRepository.create.mockResolvedValue(created);

			await expect(service.createUser(dto)).resolves.toEqual(created);
			expect(usersRepository.create).toHaveBeenCalledWith({
				...dto,
				slug: 'john_doe',
			});
		});

		it('should throw if slug is reserved', async () => {
			const dto = { name: 'Me', email: 'a@b.com', password: 'pass' };
			await expect(service.createUser(dto)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('createUserGoogle', () => {
		it('should create google user with slug', async () => {
			const dto = { name: 'Alice', email: 'a@b.com', googleId: '123' };
			const created = { ...dto, slug: 'alice' };
			usersRepository.create.mockResolvedValue(created);

			await expect(service.createUserGoogle(dto)).resolves.toEqual(
				created,
			);
			expect(usersRepository.create).toHaveBeenCalledWith({
				...dto,
				slug: 'alice',
			});
		});
	});

	describe('getUserByEmail', () => {
		it('should find user by email', async () => {
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

	describe('findByGoogleId', () => {
		it('should find user by googleId', async () => {
			const user = { id: '1', googleId: '123' };
			usersRepository.findOne.mockResolvedValue(user);

			await expect(service.findByGoogleId('123')).resolves.toEqual(user);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { googleId: '123' },
			});
		});
	});

	describe('findLoggedUser', () => {
		it('should return selected attributes', async () => {
			const user = {
				id: '1',
				name: 'A',
				slug: 'a',
				email: 'a@b.com',
				profileImgUrl: '',
				bio: '',
				followersNumber: 0,
			};
			usersRepository.findOne.mockResolvedValue(user);

			await expect(service.findLoggedUser('1')).resolves.toEqual(user);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { id: '1' },
				attributes: [
					'id',
					'name',
					'slug',
					'email',
					'profileImgUrl',
					'bio',
					'followersNumber',
				],
			});
		});
	});

	describe('findUser', () => {
		it('should throw NotFoundException if user not found', async () => {
			usersRepository.findOne.mockResolvedValue(null);
			await expect(service.findUser('slug', undefined)).rejects.toThrow(
				NotFoundException,
			);
		});

		it('should return public user if not logged in', async () => {
			const mockUser = {
				id: '1',
				name: 'A',
				slug: 'a',
				email: 'a@b.com',
				profileImgUrl: '',
				bio: '',
				followersNumber: 0,
				projects: [
					{
						id: 'p1',
						name: 'proj1',
						get: () => ({
							id: 'p1',
							name: 'proj1',
							devlogEvents: [{ id: 'd1' }],
						}),
						devlogEvents: [{ id: 'd1' }],
					},
				],
			};
			usersRepository.findOne.mockResolvedValue(mockUser);

			const result = await service.findUser('a', '2');
			expect(result).toHaveProperty('projects');
			expect(result).toHaveProperty('devlogs');
			expect(result).not.toHaveProperty('email'); // public
		});

		it('should return full user if same userId', async () => {
			const mockUser = {
				id: '1',
				name: 'A',
				slug: 'a',
				email: 'a@b.com',
				profileImgUrl: '',
				bio: '',
				followersNumber: 0,
				projects: [
					{
						id: 'p1',
						name: 'proj1',
						get: () => ({
							id: 'p1',
							name: 'proj1',
							devlogEvents: [{ id: 'd1' }],
						}),
						devlogEvents: [{ id: 'd1' }],
					},
				],
			};
			usersRepository.findOne.mockResolvedValue(mockUser);

			const result = await service.findUser('a', '1');
			expect(result).toHaveProperty('projects');
			expect(result).toHaveProperty('devlogs');
			expect(result).toHaveProperty('email'); // full
		});
	});

	describe('updateUser', () => {
		it('should call update with correct params', async () => {
			usersRepository.update.mockResolvedValue(['ok']);
			await service.updateUser('1', {
				name: 'New',
				bio: 'sdasd',
				profileImgUrl: 'asdasd',
			});
			expect(usersRepository.update).toHaveBeenCalledWith(
				{
					name: 'New',
					bio: 'sdasd',
					profileImgUrl: 'asdasd',
				},
				{ where: { id: '1' }, returning: true },
			);
		});
	});

	describe('getTrendingUsers', () => {
		it('should call findAll with proper params', async () => {
			const trending = [
				{ id: '1', name: 'A' },
				{ id: '2', name: 'B' },
			];
			usersRepository.findAll.mockResolvedValue(trending);

			await expect(service.getTrendingUsers()).resolves.toEqual(trending);
			expect(usersRepository.findAll).toHaveBeenCalled();
		});
	});
});
