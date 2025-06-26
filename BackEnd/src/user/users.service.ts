import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import {
	followsRepositoryToken,
	postsRepositoryToken,
	usersRepositoryToken,
} from 'src/constants';
import { User } from './user.entity';
import { createUserDto } from 'src/user/dtos/user.dto';
import { Post } from 'src/post/post.entity';
import { updateUserDto } from 'src/user/dtos/updateUser.dto';
import { Follow } from './follow.entity';

@Injectable()
export class UsersService {
	constructor(
		@Inject(usersRepositoryToken)
		private usersRepository: typeof User,
		@Inject(postsRepositoryToken)
		private postsRepository: typeof Post,
		@Inject(followsRepositoryToken)
		private followsRepository: typeof Follow,
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

	async findUserBasic(id: string) {
		return await this.getUserById(id, [
			'name',
			'profileImgUrl',
			'followers',
		]);
	}

	async findUser(id: string) {
		return await this.getUserById(id, [
			'id',
			'name',
			'email',
			'profileImgUrl',
			'bio',
			'followers',
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
			'followers',
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

		await this.usersRepository.increment('followers', {
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

		await this.usersRepository.decrement('followers', {
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
