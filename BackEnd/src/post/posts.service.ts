import {
	Injectable,
	Inject,
	UnauthorizedException,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { Post } from './post.entity';
import { createPostDto } from 'src/post/dtos/post.dto';
import { likesRepositoryToken, postsRepositoryToken } from 'src/constants';
import { EditPostDto } from 'src/post/dtos/editPost.dto';
import { Like } from './like.entity';
import { Op } from 'sequelize';


@Injectable()
export class PostsService {
	constructor(
		@Inject(postsRepositoryToken)
		private postsRepository: typeof Post,
		@Inject(likesRepositoryToken)
		private likesRepository: typeof Like,
	) {}

	private normalizeToArray(input?: string | string[]): string[]{
		if (!input) return [];
		return Array.isArray(input) ? input : [input];
	};

	async findPostsByTagAndCategory(tag?: string | string[], category?: string | string[]): Promise<Post[]> {
		const tags = this.normalizeToArray(tag);
		const categorys = this.normalizeToArray(category);
		const conditions: any[] = [];

		if (tags && tags.length > 0) {
			conditions.push({
				tags: {
					[Op.overlap]: tags
				}
			});
		}

		if (categorys && categorys.length > 0) {
			conditions.push({
				categorys: {
					[Op.overlap]: categorys
				}
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
			categorys,
			previewImgUrl,
			description,
			slug,
		}: createPostDto,
	) {
		return await this.postsRepository.create({
			title,
			content,
			userId: userId,
			tags,
			categorys,
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

	async likePost(likerId: string, likedId: string) {
		const relation = await this.likesRepository.findOne({
			where: {
				likerId,
				likedId,
			},
		});

		if (relation) {
			throw new ConflictException('You already liked this.');
		}

		await this.postsRepository.increment('likes', {
			where: {
				id: likedId,
			},
		});

		await this.likesRepository.create({
			likerId,
			likedId,
		});

		return { message: 'Liked successfully' };
	}

	async unlikePost(likerId: string, likedId: string) {
		const relation = await this.likesRepository.findOne({
			where: {
				likerId,
				likedId,
			},
		});

		if (!relation) {
			throw new ConflictException("You haven't liked this post.");
		}

		await this.postsRepository.decrement('likes', {
			where: {
				id: likedId,
			},
		});

		await this.likesRepository.destroy({
			where: {
				likerId,
				likedId,
			},
		});

		return { message: 'Unliked successfully' };
	}

	async getLikePost(likerId: string, likedId: string) {
		return !!(await this.likesRepository.findOne({
			where: {
				likerId,
				likedId,
			},
		}));
	}
}
