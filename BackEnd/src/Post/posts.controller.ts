import {
	Req,
	Controller,
	Get,
	Post,
	Body,
	Patch,
	UseGuards,
	Param,
	BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { createPostDto } from 'src/Post/dtos/post.dto';
import { Request } from 'express';
import { EditPostDto } from 'src/Post/dtos/editPost.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { LikePostDto } from './dtos/likePost.dto';
import { isUUID } from 'class-validator';

@Controller('post')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
	async findPosts() {
		return await this.postsService.findAll();
	}

	@UseGuards(AuthGuard)
	@Post()
	async createPost(@Req() req: AuthRequest, @Body() body: createPostDto) {
		const { userId } = req.user;
		return await this.postsService.createPost(userId, body);
	}

	@Get('/id/:id')
	async findPost(@Req() req: Request) {
		const postId = req.params.id;
		return await this.postsService.findPost(postId);
	}

	@Get(':slug')
	async findPostSlug(@Param('slug') slug: string) {
		return await this.postsService.findPostSlug(slug);
	}

	@UseGuards(AuthGuard)
	@Patch(':postId')
	async updatePost(
		@Param('postId') postId: string,
		@Req() req: AuthRequest,
		@Body() body: EditPostDto,
	) {
		const { userId } = req.user;
		return await this.postsService.updatePost(postId, userId, body);
	}

	@UseGuards(AuthGuard)
	@Post('/like')
	async followUser(@Req() req: AuthRequest, @Body() body: LikePostDto) {
		const likerId = req?.user?.userId;
		return await this.postsService.likePost(likerId, body.likedId);
	}

	@UseGuards(AuthGuard)
	@Post('/unlike')
	async unlikePost(@Req() req: AuthRequest, @Body() body: LikePostDto) {
		const likerId = req?.user?.userId;
		return await this.postsService.unlikePost(likerId, body.likedId);
	}

	@UseGuards(AuthGuard)
	@Get('/like/:likerId')
	async getLikePost(
		@Req() req: AuthRequest,
		@Param('likerId') likedId: string,
	) {
		const likerId = req?.user?.userId;
		if (!isUUID(likerId)) {
			throw new BadRequestException('The followedId must be an uuid.');
		}

		return await this.postsService.getLikePost(likerId, likedId);
	}
}
