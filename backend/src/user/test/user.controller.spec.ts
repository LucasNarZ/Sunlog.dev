import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserNotFoundException } from 'src/exceptions/UserNotFound.exception';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { Request } from 'express';
import { updateUserDto } from 'src/user/dtos/updateUser.dto';
import { FollowUserDto } from '../dtos/followUser.dto';

describe('UsersController', () => {
	let controller: UsersController;
	let usersService: Partial<Record<keyof UsersService, jest.Mock>>;

	beforeEach(async () => {
		usersService = {
			findUserBasic: jest.fn(),
			findUser: jest.fn(),
			findUserPublic: jest.fn(),
			getPostByUser: jest.fn(),
			updateUser: jest.fn(),
			followUser: jest.fn(),
			unfollowUser: jest.fn(),
			getFollowUser: jest.fn(),
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

	describe('findUserBasicInfo', () => {
		it('should call usersService.findUserBasic and return user basic info', async () => {
			const userBasic = {
				name: 'John',
				profileImgUrl: 'img.jpg',
				followers: 10,
			};
			usersService.findUserBasic!.mockResolvedValue(userBasic);
			expect(await controller.findUserBasicInfo('d02cc816-b60b-49c9-b0a8-0acf5caebafb')).toEqual(
				userBasic,
			);
			expect(usersService.findUserBasic).toHaveBeenCalledWith('d02cc816-b60b-49c9-b0a8-0acf5caebafb');
		});
	});

	describe('findUser', () => {
		it('should throw UnauthorizedException if no user id', async () => {
			const req = { user: {} } as AuthRequest;
			await expect(controller.findUser(req)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('should throw UserNotFoundException if user not found', async () => {
			const req = { user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' } } as AuthRequest;
			usersService.findUser!.mockResolvedValue(null);
			await expect(controller.findUser(req)).rejects.toThrow(
				UserNotFoundException,
			);
			expect(usersService.findUser).toHaveBeenCalledWith('d02cc816-b60b-49c9-b0a8-0acf5caebafb');
		});

		it('should return user if found', async () => {
			const req = { user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' } } as AuthRequest;
			const user = { id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb', name: 'John' };
			usersService.findUser!.mockResolvedValue(user);
			expect(await controller.findUser(req)).toEqual(user);
		});
	});

	describe('findUserPublic', () => {
		it('should call usersService.findUserPublic and return user', async () => {
			const user = { id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb', name: 'John' };
			usersService.findUserPublic!.mockResolvedValue(user);
			expect(await controller.findUserPublic('d02cc816-b60b-49c9-b0a8-0acf5caebafb')).toEqual(user);
			expect(usersService.findUserPublic).toHaveBeenCalledWith('d02cc816-b60b-49c9-b0a8-0acf5caebafb');
		});
	});

	describe('getUserPosts', () => {
		it('should call usersService.getPostByUser with correct id', async () => {
			const req = { params: { id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' } } as unknown as Request;
			const posts = [{ id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' }, { id: 'd02cc816-b60b-49c9-b0a8-0acf5caebafc' }];
			usersService.getPostByUser!.mockResolvedValue(posts);
			expect(await controller.getUserPosts(req)).toEqual(posts);
			expect(usersService.getPostByUser).toHaveBeenCalledWith('d02cc816-b60b-49c9-b0a8-0acf5caebafb');
		});
	});

	describe('updateUser', () => {
		it('should call usersService.updateUser with userId and body', async () => {
			const req = { user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' } } as AuthRequest;
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

	describe('followUser', () => {
		it('should call usersService.followUser with followerId and followedId', async () => {
			const req = { user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' } } as AuthRequest;
			const dto: FollowUserDto = { followedId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafc' };
			usersService.followUser!.mockResolvedValue({
				message: 'Followed successfully',
			});
			expect(await controller.followUser(req, dto)).toEqual({
				message: 'Followed successfully',
			});
			expect(usersService.followUser).toHaveBeenCalledWith('d02cc816-b60b-49c9-b0a8-0acf5caebafb', 'd02cc816-b60b-49c9-b0a8-0acf5caebafc');
		});
	});

	describe('unfollowUser', () => {
		it('should call usersService.unfollowUser with followerId and followedId', async () => {
			const req = { user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' } } as AuthRequest;
			const dto: FollowUserDto = { followedId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafc' };
			usersService.unfollowUser!.mockResolvedValue({
				message: 'Unfollowed successfully',
			});
			expect(await controller.unfollowUser(req, dto)).toEqual({
				message: 'Unfollowed successfully',
			});
			expect(usersService.unfollowUser).toHaveBeenCalledWith(
				'd02cc816-b60b-49c9-b0a8-0acf5caebafb',
				'd02cc816-b60b-49c9-b0a8-0acf5caebafc',
			);
		});
	});

	describe('getFollowUser', () => {
		it('should throw BadRequestException if followedId is not UUID', async () => {
			const req = { user: { userId: '123' } } as AuthRequest;
			await expect(
				controller.getFollowUser(req, 'invalid-uuid'),
			).rejects.toThrow(BadRequestException);
		});

		it('should call usersService.getFollowUser and return result', async () => {
			const req = { user: { userId: '123' } } as AuthRequest;
			const validUuid = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
			usersService.getFollowUser!.mockResolvedValue(true);
			expect(await controller.getFollowUser(req, validUuid)).toBe(true);
			expect(usersService.getFollowUser).toHaveBeenCalledWith(
				'123',
				validUuid,
			);
		});
	});
});
