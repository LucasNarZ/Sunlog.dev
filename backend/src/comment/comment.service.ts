import { Inject, Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { commentRepositoryToken } from 'src/constants';
import { User } from 'src/user/user.entity';
import { CreateCommentDto } from './dtos/createComment.dto';

@Injectable()
export class CommentService {
	constructor(
		@Inject(commentRepositoryToken)
		private commentsRepository: typeof Comment,
	) {}

	async getPostComments(postId: string) {
		const devlogEvents = await this.commentsRepository.findAll({
			where: {
				postId,
			},
			include: [
				{
					model: User,
					as: 'author',
					attributes: ['name', 'profileImgUrl'],
					required: true,
				},
			],
			attributes: ['id', 'content', 'commentParentId', 'createdAt'],
		});

		return devlogEvents;
	}

	async createComment(
		postId: string,
		authorId: string,
		post: CreateCommentDto,
	) {
		const createdPost = await this.commentsRepository.create({
			content: post.content,
			authorId,
			postId,
			commentParentId: post.commentParentId ?? null,
		});

		return createdPost;
	}
}
