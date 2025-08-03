import {
	Controller,
	Get,
	Body,
	Req,
	Put,
	UseGuards,
	UnauthorizedException,
	Param,
	Post,
	BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersService } from './users.service';
import { Request } from 'express';
import { updateUserDto } from 'src/user/dtos/updateUser.dto';
import { UserNotFoundException } from 'src/exceptions/UserNotFound.exception';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { FollowUserDto } from './dtos/followUser.dto';
import { isUUID } from 'class-validator';

@Controller('user')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AuthGuard)
	@Get('profile')
	async findUser(@Req() req: AuthRequest) {
		const id = req.user.userId;
		if (!id) {
			throw new UnauthorizedException('User is not logged');
		}
		const user = await this.usersService.findUser(id);
		if (!user) {
			throw new UserNotFoundException(`user with id ${id} not found`);
		}
		return user;
	}

	@Get('public/:userId')
	async findUserPublic(@Param('userId') userId: string) {
		if(!isUUID(userId)){
			throw new BadRequestException("UserId must be an UUID.");
		}
		return await this.usersService.findUserPublic(userId);
	}

	@Get(':id/posts')
	async getUserPosts(@Req() req: Request) {
		const { id } = req.params;
		if(!isUUID(id)){
			throw new BadRequestException("UserId must be an UUID.");
		}
		const posts = await this.usersService.getPostByUser(id);
		return posts;
	}

	@UseGuards(AuthGuard)
	@Put('update')
	async updateUser(@Req() req: AuthRequest, @Body() body: updateUserDto) {
		const id = req?.user?.userId;
		return await this.usersService.updateUser(id, body);
	}

	@UseGuards(AuthGuard)
	@Post('/follow')
	async followUser(@Req() req: AuthRequest, @Body() body: FollowUserDto) {
		const followerId = req?.user?.userId;
		return await this.usersService.followUser(followerId, body.followedId);
	}

	@UseGuards(AuthGuard)
	@Post('/unfollow')
	async unfollowUser(@Req() req: AuthRequest, @Body() body: FollowUserDto) {
		const followerId = req?.user?.userId;
		return await this.usersService.unfollowUser(
			followerId,
			body.followedId,
		);
	}

	@UseGuards(AuthGuard)
	@Get('/follow/:followedId')
	async getFollowUser(
		@Req() req: AuthRequest,
		@Param('followedId') followedId: string,
	) {
		const followerId = req?.user?.userId;
		if (!isUUID(followedId)) {
			throw new BadRequestException('The followedId must be an uuid.');
		}

		return await this.usersService.getFollowUser(followerId, followedId);
	}

	@UseGuards(AuthGuard)
	@Get("/me/id")
	getLoggedUserId(@Req() req: AuthRequest){
		return req?.user?.userId;
	}

	@Get("/trending-users")
	async getTrendingUsers() {
		return await this.usersService.getTrendingUsers();
	}
}
