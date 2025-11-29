import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/createComment.dto';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('post/:postId/comments')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Get('/')
	async getPostComments(@Param('postId') postId: string) {
		return await this.commentService.getPostComments(postId);
	}

	@UseGuards(AuthGuard)
	@Post('/')
	async createComment(
		@Req() req: AuthRequest,
		@Param('postId') postId: string,
		@Body() body: CreateCommentDto,
	) {
		const authorId = req.user.userId;
		return await this.commentService.createComment(postId, authorId, body);
	}
}
