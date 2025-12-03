import {
	Req,
	Controller,
	Get,
	Body,
	UseGuards,
	Param,
	BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { LikeService } from './like.service';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
// import { LikeDevlogEventDto } from './dtos/likeDevlogEvent.dto';
import { isUUID } from 'class-validator';

@Controller('like')
export class LikeController {
	constructor(private readonly likeService: LikeService) {}

	// @UseGuards(AuthGuard)
	// @DevlogEvent('/likeDevlogEvent')
	// async followUser(@Req() req: AuthRequest, @Body() body: LikeDevlogEventDto) {
	// 	const likerId = req?.user?.userId;
	// 	return await this.likeService.likeDevlogEvent(likerId, body.likedId);
	// }

	// @UseGuards(AuthGuard)
	// @DevlogEvent('/unlikeDevlogEvent')
	// async unlikeDevlogEvent(@Req() req: AuthRequest, @Body() body: LikeDevlogEventDto) {
	// 	const likerId = req?.user?.userId;
	// 	return await this.likeService.unlikeDevlogEvent(likerId, body.likedId);
	// }

	@UseGuards(AuthGuard)
	@Get('/:likerId')
	async getLikeDevlogEvent(
		@Req() req: AuthRequest,
		@Param('likerId') likedId: string,
	) {
		const likerId = req?.user?.userId;
		if (!isUUID(likerId)) {
			throw new BadRequestException('The followedId must be an uuid.');
		}

		return await this.likeService.getLikeDevlogEvent(likerId, likedId);
	}
}
