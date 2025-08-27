
import {
	Controller,
	Get,
	Body,
	Req,
	UseGuards,
	Param,
	Post,
	BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FollowService } from 'src/follow/follow.service';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { FollowUserDto } from './dtos/followUser.dto';
import { isUUID } from 'class-validator';

@Controller('follow')
export class FollowController {
	constructor(private readonly followService: FollowService) {}

	@UseGuards(AuthGuard)
	@Post('/followUser')
	async followUser(@Req() req: AuthRequest, @Body() body: FollowUserDto) {
		const followerId = req?.user?.userId;
		return await this.followService.followUser(followerId, body.followedId);
	}

	@UseGuards(AuthGuard)
	@Post('/unfollowUser')
	async unfollowUser(@Req() req: AuthRequest, @Body() body: FollowUserDto) {
		const followerId = req?.user?.userId;
		return await this.followService.unfollowUser(
			followerId,
			body.followedId,
		);
	}

	@UseGuards(AuthGuard)
	@Get('/:followedId')
	async getFollowUser(
		@Req() req: AuthRequest,
		@Param('followedId') followedId: string,
	) {
		const followerId = req?.user?.userId;
		if (!isUUID(followedId)) {
			throw new BadRequestException('The followedId must be an uuid.');
		}

		return await this.followService.getFollowUser(followerId, followedId);
	}
}
