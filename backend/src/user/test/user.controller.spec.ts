import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserNotFoundException } from 'src/exceptions/UserNotFound.exception';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { Request } from 'express';
import { updateUserDto } from 'src/user/dtos/updateUser.dto';

describe('UsersController', () => {
	let controller: UsersController;
	let usersService: Partial<Record<keyof UsersService, jest.Mock>>;

	beforeEach(async () => {
		usersService = {
			findUser: jest.fn(),
			findUserPublic: jest.fn(),
			getPostByUser: jest.fn(),
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

	describe('findUser', () => {
		it('should throw UnauthorizedException if no user id', async () => {
			const req = { user: {} } as AuthRequest;
			await expect(controller.findUser(req)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('should throw UserNotFoundException if user not found', async () => {
			const req = {
				user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' },
			} as AuthRequest;
			usersService.findUser!.mockResolvedValue(null);
			await expect(controller.findUser(req)).rejects.toThrow(
				UserNotFoundException,
			);
			expect(usersService.findUser).toHaveBeenCalledWith(
				'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
			);
		});

		it('should return user if found', async () => {
			const req = {
				user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' },
			} as AuthRequest;
			const user = {
				id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
				name: 'John',
			};
			usersService.findUser!.mockResolvedValue(user);
			expect(await controller.findUser(req)).toEqual(user);
		});
	});

	describe('findUserPublic', () => {
		it('should call usersService.findUserPublic and return user', async () => {
			const user = {
				id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
				name: 'John',
			};
			usersService.findUserPublic!.mockResolvedValue(user);
			expect(
				await controller.findUserPublic(
					'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
				),
			).toEqual(user);
			expect(usersService.findUserPublic).toHaveBeenCalledWith(
				'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
			);
		});
	});

	describe('getUserDevlogEvents', () => {
		it('should call usersService.getPostByUser with correct id', async () => {
			const req = {
				params: { id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' },
			} as unknown as Request;
			const devlogEvents = [
				{ id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' },
				{ id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafc' },
			];
			usersService.getPostByUser!.mockResolvedValue(devlogEvents);
			expect(await controller.getUserDevlogEvents(req)).toEqual(devlogEvents);
			expect(usersService.getPostByUser).toHaveBeenCalledWith(
				'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
			);
		});
	});

	describe('updateUser', () => {
		it('should call usersService.updateUser with userId and body', async () => {
			const req = {
				user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' },
			} as AuthRequest;
			const updateDto: updateUserDto = {
				name: 'New Name',
				bio: 'New bio',
				profileImgUrl: 'http://image.url/img.png',
			};
			usersService.updateUser!.mockResolvedValue('updated');
			expect(await controller.updateUser(req, updateDto)).toEqual(
				'updated',
			);
			expect(usersService.updateUser).toHaveBeenCalledWith(
				'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
				updateDto,
			);
		});
	});
});
