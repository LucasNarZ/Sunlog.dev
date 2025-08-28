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
	Delete
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { createPostDto } from 'src/post/dtos/post.dto';
import { Request } from 'express';
import { EditPostDto } from 'src/post/dtos/editPost.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { LikePostDto } from '../like/dtos/likePost.dto';
import { isUUID } from 'class-validator';

@Controller('post')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
	async findPostsByTagAndCategory(@Query("tag") tag: string | string[] | undefined, @Query("category") category: string | undefined) {
		return await this.postsService.findPostsByTagAndCategory(tag, category);
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
	@Delete(":postId")
	async deletePost(@Param("postId") postId: string, @Req() req: AuthRequest,) {
		if(!isUUID(postId)){
			throw new BadRequestException("postId must be an UUID.");
		}
		const { userId } = req.user;

		return this.postsService.deletePost(postId, userId);
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

  @Get("/trending/trending-devlogs")
  async getTrendingDevlogs(){
    return await this.postsService.getTrendingDevlogs();
  }

}

