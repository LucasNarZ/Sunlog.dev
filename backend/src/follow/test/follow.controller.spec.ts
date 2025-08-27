import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from '../follow.controller';
import { FollowService } from '../follow.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {  BadRequestException } from '@nestjs/common';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { FollowUserDto } from '../dtos/followUser.dto';

describe('UsersController', () => {
    let controller: FollowController;
    let followService: Partial<Record<keyof FollowService, jest.Mock>>;

    beforeEach(async () => {
        followService = {
            followUser: jest.fn(),
            unfollowUser: jest.fn(),
            getFollowUser: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [FollowController],
            providers: [{ provide: FollowService, useValue: followService }],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<FollowController>(FollowController);
    });

    describe('followUser', () => {
        it('should call usersService.followUser with followerId and followedId', async () => {
            const req = { user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' } } as AuthRequest;
            const dto: FollowUserDto = { followedId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafc' };
            followService.followUser!.mockResolvedValue({
                message: 'Followed successfully',
            });
            expect(await controller.followUser(req, dto)).toEqual({
                message: 'Followed successfully',
            });
            expect(followService.followUser).toHaveBeenCalledWith('d02cc816-b60b-49c9-b0a8-0acf5caebafb', 'd02cc816-b60b-49c9-b0a8-0acf5caebafc');
        });
    });

    describe('unfollowUser', () => {
        it('should call usersService.unfollowUser with followerId and followedId', async () => {
            const req = { user: { userId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafb' } } as AuthRequest;
            const dto: FollowUserDto = { followedId: 'd02cc816-b60b-49c9-b0a8-0acf5caebafc' };
            followService.unfollowUser!.mockResolvedValue({
                message: 'Unfollowed successfully',
            });
            expect(await controller.unfollowUser(req, dto)).toEqual({
                message: 'Unfollowed successfully',
            });
            expect(followService.unfollowUser).toHaveBeenCalledWith(
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
            followService.getFollowUser!.mockResolvedValue(true);
            expect(await controller.getFollowUser(req, validUuid)).toBe(true);
            expect(followService.getFollowUser).toHaveBeenCalledWith(
                '123',
                validUuid,
            );
        });
    });
});
