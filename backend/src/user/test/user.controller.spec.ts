import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserNotFoundException } from 'src/exceptions/UserNotFound.exception';
import { AuthGuard } from 'src/auth/guards/auth.guard';

describe('UsersController', () => {
	let controller: UsersController;
	let usersService: any;

	beforeEach(async () => {
		usersService = {
			findLoggedUser: jest.fn(),
			getTrendingUsers: jest.fn(),
			findUser: jest.fn(),
			updateUser: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [{ provide: UsersService, useValue: usersService }],
		})
			.overrideGuard(AuthGuard)
			.useValue({ canActivate: jest.fn(() => true) })
			.compile();

		controller = module.get<UsersController>(UsersController);
	});

	describe('findLoggedUser', () => {
		it('should return logged user', async () => {
			const req = { user: { userId: '1' } };
			const mockUser = { id: '1', name: 'John' };
			usersService.findLoggedUser.mockResolvedValue(mockUser);

			await expect(
				controller.findLoggedUser(req as any),
			).resolves.toEqual(mockUser);
			expect(usersService.findLoggedUser).toHaveBeenCalledWith('1');
		});

		it('should throw UnauthorizedException if no userId', async () => {
			const req = { user: {} };
			await expect(controller.findLoggedUser(req as any)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('should throw UserNotFoundException if service returns null', async () => {
			const req = { user: { userId: '1' } };
			usersService.findLoggedUser.mockResolvedValue(null);

			await expect(controller.findLoggedUser(req as any)).rejects.toThrow(
				UserNotFoundException,
			);
		});
	});

	describe('getTrendingUsers', () => {
		it('should return trending users', async () => {
			const trending = [{ id: '1', name: 'A' }];
			usersService.getTrendingUsers.mockResolvedValue(trending);

			await expect(controller.getTrendingUsers()).resolves.toEqual(
				trending,
			);
			expect(usersService.getTrendingUsers).toHaveBeenCalled();
		});
	});

	describe('findUser', () => {
		it('should call service.findUser with slug and userId', async () => {
			const req = { user: { userId: '2' } };
			const user = { id: '1', name: 'A' };
			usersService.findUser.mockResolvedValue(user);

			await expect(controller.findUser(req as any, 'a')).resolves.toEqual(
				user,
			);
			expect(usersService.findUser).toHaveBeenCalledWith('a', '2');
		});

		it('should handle undefined userId', async () => {
			const req = {};
			const user = { id: '1', name: 'A' };
			usersService.findUser.mockResolvedValue(user);

			await expect(controller.findUser(req as any, 'a')).resolves.toEqual(
				user,
			);
			expect(usersService.findUser).toHaveBeenCalledWith('a', undefined);
		});
	});

	describe('updateUser', () => {
		it('should call service.updateUser with logged user id', async () => {
			const req = { user: { userId: '1' } };
			const body = {
				name: 'New',
				bio: 'asdasd',
				profileImgUrl: 'asdasd',
			};
			const updated = { id: '1', name: 'New' };
			usersService.updateUser.mockResolvedValue(updated);

			await expect(
				controller.updateUser(req as any, body),
			).resolves.toEqual(updated);
			expect(usersService.updateUser).toHaveBeenCalledWith('1', body);
		});
	});

	describe('getLoggedUserId', () => {
		it('should return the logged userId', () => {
			const req = { user: { userId: '1' } };
			expect(controller.getLoggedUserId(req as any)).toBe('1');
		});

		it('should return undefined if no user', () => {
			const req = {};
			expect(controller.getLoggedUserId(req as any)).toBeUndefined();
		});
	});
});
