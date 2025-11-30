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
	Query,
	Delete,
	Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { createPostDto } from 'src/post/dtos/post.dto';
import { Request } from 'express';
import { EditPostDto } from 'src/post/dtos/editPost.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { LikePostDto } from '../like/dtos/likePost.dto';
import { isUUID } from 'class-validator';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
	async findPostsByTagAndCategory(
		@Query('tag') tag: string | string[] | undefined,
		@Query('category') category: string | undefined,
	) {
		return await this.postsService.findPostsByTagAndCategory(tag, category);
	}

	@UseGuards(AuthGuard)
	@Post()
	async createPost(@Req() req: AuthRequest, @Body() body: createPostDto) {
		const { userId } = req.user;
		return await this.postsService.createPost(userId, body);
	}

	@Get('trending')
	async getTrendingDevlogs() {
		return await this.postsService.getTrendingDevlogs();
	}

	@Get(':postId')
	async findPost(@Req() req: Request) {
		const postId = req.params.postId;
		return await this.postsService.findPost(postId);
	}

	@Get('slug/:slug')
	async findPostSlug(@Param('slug') slug: string) {
		return await this.postsService.findPostSlug(slug);
	}

	@UseGuards(AuthGuard)
	@Put(':postId')
	async updatePost(
		@Param('postId') postId: string,
		@Req() req: AuthRequest,
		@Body() body: createPostDto,
	) {
		console.log('post:', body);
		const { userId } = req.user;
		return await this.postsService.updatePost(postId, userId, body);
	}

	@UseGuards(AuthGuard)
	@Delete(':postId')
	async deletePost(@Param('postId') postId: string, @Req() req: AuthRequest) {
		if (!isUUID(postId)) {
			throw new BadRequestException('postId must be an UUID.');
		}
		const { userId } = req.user;

		return this.postsService.deletePost(postId, userId);
	}
}
