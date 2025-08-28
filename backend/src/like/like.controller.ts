import {
    Req,
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
    BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { LikeService } from './like.service';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { LikePostDto } from './dtos/likePost.dto';
import { isUUID } from 'class-validator';

@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}
    
    @UseGuards(AuthGuard)
    @Post('/likePost')
    async followUser(@Req() req: AuthRequest, @Body() body: LikePostDto) {
        const likerId = req?.user?.userId;
        return await this.likeService.likePost(likerId, body.likedId);
    }

    @UseGuards(AuthGuard)
    @Post('/unlikePost')
    async unlikePost(@Req() req: AuthRequest, @Body() body: LikePostDto) {
        const likerId = req?.user?.userId;
        return await this.likeService.unlikePost(likerId, body.likedId);
    }

    @UseGuards(AuthGuard)
    @Get('/:likerId')
    async getLikePost(
        @Req() req: AuthRequest,
        @Param('likerId') likedId: string,
    ) {
        const likerId = req?.user?.userId;
        if (!isUUID(likerId)) {
            throw new BadRequestException('The followedId must be an uuid.');
        }

        return await this.likeService.getLikePost(likerId, likedId);
    }
}

