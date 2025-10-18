import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Post } from 'src/post/post.entity';
import { likesRepositoryToken, postsRepositoryToken } from 'src/constants';
import { Like } from '../like/like.entity';

@Injectable()
export class LikeService {
	constructor(
		@Inject(postsRepositoryToken)
		private postsRepository: typeof Post,
		@Inject(likesRepositoryToken)
		private likesRepository: typeof Like,
	) {}

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

		await this.postsRepository.increment('likesNumber', {
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

		await this.postsRepository.decrement('likesNumber', {
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
