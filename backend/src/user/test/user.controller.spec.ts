import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserNotFoundException } from 'src/exceptions/UserNotFound.exception';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { updateUserDto } from '../dtos/updateUser.dto';

type MockUsersService = {
	findLoggedUser: jest.Mock;
	findLoggedUserProjects: jest.Mock;
	getTrendingUsers: jest.Mock;
	findUser: jest.Mock;
	updateUser: jest.Mock;
};

function createAuthRequest(userId?: string): AuthRequest {
	return {
		user: {
			userId: userId ?? '',
			username: 'john',
			profileImgUrl: '',
			isAdmin: false,
		},
	} as AuthRequest;
}

describe('UsersController', () => {
	let controller: UsersController;
	let usersService: MockUsersService;

	beforeEach(async () => {
		usersService = {
			findLoggedUser: jest.fn(),
			findLoggedUserProjects: jest.fn(),
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
			const req = createAuthRequest('1');
			const mockUser = { id: '1', name: 'John' };
			usersService.findLoggedUser.mockResolvedValue(mockUser);

			await expect(controller.findLoggedUser(req)).resolves.toEqual(mockUser);
			expect(usersService.findLoggedUser.mock.calls).toEqual([['1']]);
		});

		it('should throw UnauthorizedException if no userId', async () => {
			await expect(
				controller.findLoggedUser(createAuthRequest()),
			).rejects.toThrow(UnauthorizedException);
		});

		it('should throw UserNotFoundException if service returns null', async () => {
			const req = createAuthRequest('1');
			usersService.findLoggedUser.mockResolvedValue(null);

			await expect(controller.findLoggedUser(req)).rejects.toThrow(
				UserNotFoundException,
			);
		});
	});

	describe('getTrendingUsers', () => {
		it('should return trending users', async () => {
			const trending = [{ id: '1', name: 'A' }];
			usersService.getTrendingUsers.mockResolvedValue(trending);

			await expect(controller.getTrendingUsers()).resolves.toEqual(trending);
			expect(usersService.getTrendingUsers.mock.calls).toHaveLength(1);
		});
	});

	describe('findLoggedUserProjects', () => {
		it('should return logged user projects', async () => {
			const req = createAuthRequest('1');
			const projects = [{ id: 'p1', name: 'Project 1' }];
			usersService.findLoggedUserProjects.mockResolvedValue(projects);

			await expect(controller.findLoggedUserProjects(req)).resolves.toEqual(
				projects,
			);
			expect(usersService.findLoggedUserProjects.mock.calls).toEqual([
				['1'],
			]);
		});

		it('should throw UnauthorizedException if no userId', async () => {
			await expect(
				controller.findLoggedUserProjects(createAuthRequest()),
			).rejects.toThrow(UnauthorizedException);
		});
	});

	describe('findUser', () => {
		it('should call service.findUser with slug and userId', async () => {
			const req = createAuthRequest('2');
			const user = { id: '1', name: 'A' };
			usersService.findUser.mockResolvedValue(user);

			await expect(controller.findUser(req, 'a')).resolves.toEqual(user);
			expect(usersService.findUser.mock.calls).toEqual([['a', '2']]);
		});

		it('should handle undefined userId', async () => {
			const req = {} as AuthRequest;
			const user = { id: '1', name: 'A' };
			usersService.findUser.mockResolvedValue(user);

			await expect(controller.findUser(req, 'a')).resolves.toEqual(user);
			expect(usersService.findUser.mock.calls).toEqual([['a', undefined]]);
		});
	});

	describe('updateUser', () => {
		it('should call service.updateUser with logged user id', async () => {
			const req = createAuthRequest('1');
			const body: updateUserDto = {
				name: 'New',
				bio: 'asdasd',
				profileImgUrl: 'asdasd',
			};
			const updated = { id: '1', name: 'New' };
			usersService.updateUser.mockResolvedValue(updated);

			await expect(controller.updateUser(req, body)).resolves.toEqual(updated);
			expect(usersService.updateUser.mock.calls).toEqual([['1', body]]);
		});
	});

	describe('getLoggedUserId', () => {
		it('should return the logged userId', () => {
			expect(controller.getLoggedUserId(createAuthRequest('1'))).toBe('1');
		});

		it('should return undefined if no user', () => {
			const req = {} as AuthRequest;
			expect(controller.getLoggedUserId(req)).toBeUndefined();
		});
	});
});
