import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';
import {
	likesRepositoryToken,
	devlogEventRepositoryToken,
} from 'src/constants';
import { Like } from '../like/like.entity';

@Injectable()
export class LikeService {
	constructor(
		@Inject(devlogEventRepositoryToken)
		private devlogEventRepository: typeof DevlogEvent,
		@Inject(likesRepositoryToken)
		private likesRepository: typeof Like,
	) {}

	async likeDevlogEvent(likerId: string, likedId: string) {
		const relation = await this.likesRepository.findOne({
			where: {
				likerId,
				likedId,
			},
			attributes: ['id'],
		});

		if (relation) {
			throw new ConflictException('You already liked this.');
		}

		await this.devlogEventRepository.increment('likesNumber', {
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

	async unlikeDevlogEvent(likerId: string, likedId: string) {
		const relation = await this.likesRepository.findOne({
			where: {
				likerId,
				likedId,
			},
		});

		if (!relation) {
			throw new ConflictException("You haven't liked this post.");
		}

		await this.devlogEventRepository.decrement('likesNumber', {
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

	async getLikeDevlogEvent(likerId: string, likedId: string) {
		return !!(await this.likesRepository.findOne({
			where: {
				likerId,
				likedId,
			},
		}));
	}
}
