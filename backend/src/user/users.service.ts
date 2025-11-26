import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { postsRepositoryToken, usersRepositoryToken } from 'src/constants';
import { User } from './user.entity';
import { createUserDto } from 'src/user/dtos/user.dto';
import { Post } from 'src/post/post.entity';
import { Follow } from 'src/follow/follow.entity';
import { updateUserDto } from 'src/user/dtos/updateUser.dto';
import { fn, col, Op } from 'sequelize';

@Injectable()
export class UsersService {
	constructor(
		@Inject(usersRepositoryToken)
		private usersRepository: typeof User,
		@Inject(postsRepositoryToken)
		private postsRepository: typeof Post,
	) {}

	private async getUserById(id: string, attributes?: string[]) {
		const user = await this.usersRepository.findOne({
			where: { id },
			...(attributes ? { attributes } : {}),
		});

		if (!user) throw new NotFoundException('User not found!');
		return user;
	}

	async createUser({ name, email, password }: createUserDto) {
		return await this.usersRepository.create({ name, email, password });
	}

	async getUserByEmail(email: string) {
		return await this.usersRepository.findOne({ where: { email } });
	}

	async findUser(id: string) {
		return await this.getUserById(id, [
			'id',
			'name',
			'email',
			'profileImgUrl',
			'bio',
			'followersNumber',
			'createdAt',
			'updatedAt',
		]);
	}

	async findUserPublic(id: string) {
		const user = await this.getUserById(id, [
			'id',
			'name',
			'profileImgUrl',
			'bio',
			'followersNumber',
			'createdAt',
		]);
		if (!user) {
			throw new NotFoundException('User not found!');
		}

		return user;
	}

	async getPostByUser(id: string) {
		const posts = await this.postsRepository.findAll({
			where: {
				userId: id,
			},
			order: [['createdAt', 'ASC']],
		});
		if (posts.length == 0) {
			throw new NotFoundException("User doesn't have posts");
		}
		return posts;
	}

	async updateUser(id: string, data: updateUserDto) {
		return this.usersRepository.update(data, {
			where: {
				id,
			},
			returning: true,
		});
	}

	async getTrendingUsers() {
		const twoWeeksAgo = new Date();
		twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

		return await this.usersRepository.findAll({
			attributes: [
				'id',
				'name',
				'followersNumber',
				'profileImgUrl',
				[fn('COUNT', col('followers.followedId')), 'followersGained'],
			],
			include: [
				{
					model: Follow,
					as: 'followers',
					attributes: [],
					where: {
						createdAt: {
							[Op.gte]: twoWeeksAgo,
						},
					},
					duplicating: false,
				},
			],
			group: ['User.id'],
			order: [[col('followersGained'), 'DESC']],
			limit: 3,
		});
	}
}
