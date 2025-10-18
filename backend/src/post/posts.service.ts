import {
	Injectable,
	Inject,
	UnauthorizedException,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { Post } from './post.entity';
import { createPostDto } from 'src/post/dtos/post.dto';
import { postsRepositoryToken } from 'src/constants';
import { EditPostDto } from 'src/post/dtos/editPost.dto';
import { Like } from '../like/like.entity';
import { col, fn, Op } from 'sequelize';

@Injectable()
export class PostsService {
	constructor(
		@Inject(postsRepositoryToken)
		private postsRepository: typeof Post,
	) {}

	private normalizeToArray(input?: string | string[]): string[] {
		if (!input) return [];
		return Array.isArray(input) ? input : [input];
	}

	async findPostsByTagAndCategory(
		tag?: string | string[],
		category?: string,
	): Promise<Post[]> {
		const tags = this.normalizeToArray(tag);
		const conditions: any[] = [];

		if (tags && tags.length > 0) {
			conditions.push({
				tags: {
					[Op.overlap]: tags,
				},
			});
		}

		if (category) {
			conditions.push({
				category,
			});
		}

		const where = conditions.length > 0 ? { [Op.or]: conditions } : {};

		return this.postsRepository.findAll({ where });
	}

	async createPost(
		userId: string,
		{
			title,
			content,
			tags,
			category,
			previewImgUrl,
			description,
			slug,
		}: createPostDto,
	) {
		return await this.postsRepository.create({
			title,
			content,
			userId,
			tags,
			category,
			previewImgUrl,
			description,
			slug,
		});
	}

	async findPost(postId: string) {
		return await this.postsRepository.findOne<Post>({
			where: {
				id: postId,
			},
		});
	}

	async findPostSlug(slug: string) {
		const post = await this.postsRepository.findOne<Post>({
			where: {
				slug,
			},
		});

		if (!post) {
			throw new NotFoundException('Post Not Found.');
		}

		return post;
	}

	async updatePost(postId: string, userId: string, data: EditPostDto) {
		const post = await this.postsRepository.findOne({
			where: {
				postId,
			},
		});

		if (!post) {
			throw new NotFoundException('Post not found.');
		}

		if (post.userId !== userId) {
			throw new UnauthorizedException(
				'You are not the author of this post.',
			);
		}

		return await this.postsRepository.update(data, {
			where: {
				id: postId,
			},
			returning: true,
		});
	}

	async deletePost(postId: string, userId: string) {
		const post = await this.findPost(postId);

		if (!post) {
			throw new NotFoundException('Post do not exist.');
		}

		if (post.userId !== userId) {
			throw new UnauthorizedException(
				'You have to be the author of the post to delete it.',
			);
		}

		await this.postsRepository.destroy({
			where: {
				id: postId,
			},
		});

		return post;
	}

	async getTrendingDevlogs() {
		const twoWeeksAgo = new Date();
		twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

		return await this.postsRepository.findAll({
			attributes: [
				'id',
				'userId',
				'category',
				'slug',
				'tags',
				'title',
				'description',
				'previewImgUrl',
				'likesNumber',
				'createdAt',
				[fn('COUNT', col('likes.likedId')), 'likesGained'],
			],
			include: [
				{
					model: Like,
					as: 'likes',
					attributes: [],
					where: {
						createdAt: {
							[Op.gte]: twoWeeksAgo,
						},
					},
					duplicating: false,
				},
			],
			group: ['Post.id'],
			order: [[col('likesGained'), 'DESC']],
			limit: 3,
		});
	}
}
