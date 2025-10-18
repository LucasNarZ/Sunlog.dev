import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { postsRepositoryToken, usersRepositoryToken } from 'src/constants';
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
}
