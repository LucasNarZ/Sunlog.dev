import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { RESERVED_SLUGS, usersRepositoryToken } from 'src/constants';
import { User } from './user.entity';
import { createUserDto } from 'src/user/dtos/user.dto';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';
import { Follow } from 'src/follow/follow.entity';
import { updateUserDto } from 'src/user/dtos/updateUser.dto';
import { fn, col, Op } from 'sequelize';
import { Project } from 'src/project/project.entity';
import { createUserGoogleDto } from './dtos/createUserGoogle.dto';

@Injectable()
export class UsersService {
	constructor(
		@Inject(usersRepositoryToken)
		private usersRepository: typeof User,
	) {}

	async createUser({ name, email, password }: createUserDto) {
		const slug = name.toLowerCase().replace(' ', '_');

		if (RESERVED_SLUGS.includes(slug)) {
			throw new BadRequestException('This slug is reserved.');
		}

		return await this.usersRepository.create({
			name,
			email,
			password: password,
			slug,
		});
	}

	async createUserGoogle({ name, email, googleId }: createUserGoogleDto) {
		return await this.usersRepository.create({
			name,
			email,
			googleId: googleId,
			slug: name.toLowerCase().replace(' ', '_'),
		});
	}

	async linkGoogleAccount(userId: string, googleId: string) {
		return await this.usersRepository.update(
			{ googleId },
			{ where: { id: userId }, returning: true },
		);
	}

	async getUserByEmail(email: string) {
		return await this.usersRepository.findOne({ where: { email } });
	}

	async findByGoogleId(googleId: string) {
		return await this.usersRepository.findOne({
			where: { googleId },
		});
	}

	async findLoggedUser(id: string) {
		return await this.usersRepository.findOne({
			where: {
				id,
			},
			attributes: [
				'id',
				'name',
				'slug',
				'email',
				'profileImgUrl',
				'bio',
				'followersNumber',
			],
		});
	}

	async findUser(slug: string, userId: string | undefined) {
		const user = await this.usersRepository.findOne({
			where: {
				slug,
			},
			attributes: [
				'id',
				'name',
				'slug',
				'email',
				'profileImgUrl',
				'bio',
				'followersNumber',
			],
			include: [
				{
					model: Project,
					include: [{ model: DevlogEvent }],
				},
			],
		});

		if (!user) {
			throw new NotFoundException('User does not exist.');
		}
		console.log(user);

		const projectsWithAuthorSlug = user.projects.map((project) => ({
			...project.get({ plain: true }),
			authorSlug: user.slug,
		}));

		const devlogs = projectsWithAuthorSlug.flatMap((project) =>
			project.devlogEvents.map((devlog) => ({
				...devlog,
				projectId: project.id,
				projectName: project.name,
				authorSlug: user.slug,
			})),
		);

		if (!userId || user.id !== userId) {
			const { id, name, slug, profileImgUrl, bio, followersNumber } =
				user;

			const publicUser = {
				id,
				name,
				slug,
				profileImgUrl,
				bio,
				followersNumber,
			};

			return {
				...publicUser,
				projects: projectsWithAuthorSlug,
				devlogs,
			};
		}

		return {
			...user,
			projects: projectsWithAuthorSlug,
			devlogs,
		};
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
