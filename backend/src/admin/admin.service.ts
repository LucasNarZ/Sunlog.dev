import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
	postsRepositoryToken,
	postStatusesRepositryToken,
	usersRepositoryToken,
} from 'src/constants';
import { User } from 'src/user/user.entity';
import { Post } from 'src/post/post.entity';
import { PostStatus } from 'src/post/postStatus.entity';

@Injectable()
export class AdminService {
	constructor(
		@Inject(usersRepositoryToken)
		private usersRepository: typeof User,
		@Inject(postsRepositoryToken)
		private postRepository: typeof Post,
		@Inject(postStatusesRepositryToken)
		private postStatusRepository: typeof PostStatus,
	) {}

	async getPostsByStatus(status: string) {
		const posts = await this.postRepository.findAll({
			include: [{ model: PostStatus, attributes: ['name'] }],
			where: {
				'$status.name$': status,
			},
		});

		if (!posts) {
			throw new NotFoundException('No Posts found for this status.');
		}

		return posts;
	}

	async updatePostStatus(postId: string, statusName: string) {
		const status = await this.postStatusRepository.findOne({
			where: {
				name: statusName,
			},
			attributes: ['id'],
		});

		if (!status) {
			throw new NotFoundException('Post Status not found.');
		}

		const [affected] = await this.postRepository.update(
			{ status: status.id },
			{ where: { id: postId } },
		);

		if (affected == 0) {
			throw new NotFoundException('No Posts found for this status.');
		}

		return affected;
	}
}
