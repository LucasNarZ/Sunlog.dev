import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
	devlogEventRepositoryToken,
	projectRepositoryToken,
	usersRepositoryToken,
} from 'src/constants';
import { User } from './user.entity';
import { createUserDto } from 'src/user/dtos/user.dto';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';
import { Follow } from 'src/follow/follow.entity';
import { updateUserDto } from 'src/user/dtos/updateUser.dto';
import { fn, col, Op } from 'sequelize';
import { Project } from 'src/project/project.entity';

@Injectable()
export class UsersService {
	constructor(
		@Inject(usersRepositoryToken)
		private usersRepository: typeof User,
		@Inject(devlogEventRepositoryToken)
		private devlogEventRepository: typeof DevlogEvent,
		@Inject(projectRepositoryToken)
		private projectsRepository: typeof Project,
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
		const devlogEvents = await this.devlogEventRepository.findAll({
			where: {
				userId: id,
			},
			order: [['createdAt', 'ASC']],
		});
		return devlogEvents;
	}

	async findUserProjects(id: string) {
		const projects = await this.projectsRepository.findAll({
			where: {
				userId: id,
			},
			attributes: ['name', 'id', 'description', 'readme'],
			include: [
				{
					model: User,
					attributes: [['name', 'username']],
					required: true,
				},
			],
			order: [['createdAt', 'ASC']],
		});

		return projects;
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
