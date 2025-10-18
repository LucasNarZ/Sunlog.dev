import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { followsRepositoryToken, usersRepositoryToken } from 'src/constants';
import { User } from 'src/user/user.entity';
import { Follow } from './follow.entity';

@Injectable()
export class FollowService {
	constructor(
		@Inject(usersRepositoryToken)
		private usersRepository: typeof User,
		@Inject(followsRepositoryToken)
		private followsRepository: typeof Follow,
	) {}

	async followUser(followerId: string, followedId: string) {
		if (followedId === followerId) {
			throw new BadRequestException("You can't follow yourself.");
		}
		const relation = await this.followsRepository.findOne({
			where: {
				followerId,
				followedId,
			},
		});

		if (relation) {
			throw new ConflictException('You already follow this user.');
		}

		await this.usersRepository.increment('followersNumber', {
			where: {
				id: followedId,
			},
		});

		await this.followsRepository.create({
			followerId,
			followedId,
		});

		return { message: 'Followed successfully' };
	}

	async unfollowUser(followerId: string, followedId: string) {
		if (followedId === followerId) {
			throw new BadRequestException("You can't unfollow yourself.");
		}

		const relation = await this.followsRepository.findOne({
			where: {
				followerId,
				followedId,
			},
		});

		if (!relation) {
			throw new NotFoundException("You don't follow this user.");
		}

		await this.usersRepository.decrement('followersNumber', {
			where: {
				id: followedId,
			},
		});

		await this.followsRepository.destroy({
			where: {
				followerId,
				followedId,
			},
		});

		return { message: 'Unfollowed successfully' };
	}

	async getFollowUser(followerId: string, followedId: string) {
		return !!(await this.followsRepository.findOne({
			where: {
				followerId,
				followedId,
			},
		}));
	}
}
