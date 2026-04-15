import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import { createUserDto } from 'src/user/dtos/user.dto';
import { LoginDto } from 'src/user/dtos/login.dto';
import * as argon2 from 'argon2';
import { UniqueConstraintException } from 'src/exceptions/uniqueContraint.exception';
import { InvalidPasswordEmailException } from 'src/exceptions/InvalidPasswordEmail.exception';
import { UserPayload } from '../interfaces/userPayload.interface';
import { TokenService } from './token.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private tokenService: TokenService,
		private emailService: EmailService,
	) {}

	async register(body: createUserDto) {
		try {
			const data = {
				...body,
				password: await argon2.hash(body.password),
			};
			const user = await this.usersService.createUser(data);
			await this.emailService.sendWelcomeEmail(user);

			return {
				id: user.id,
				name: user.name,
				slug: user.slug,
				email: user.email,
				profileImgUrl: user.profileImgUrl,
				bio: user.bio,
				followersNumber: user.followersNumber,
				createdAt: user.createdAt,
			};
		} catch (err: unknown) {
			if (
				err instanceof Error &&
				err.name === 'SequelizeUniqueConstraintError'
			) {
				throw new UniqueConstraintException(
					'Email already registered.',
				);
			}
			throw err;
		}
	}

	async login(body: LoginDto) {
		const { email, password } = body;
		const user = await this.usersService.getUserByEmail(email);
		if (!user) {
			throw new InvalidPasswordEmailException();
		}
		const passwordRight = await argon2.verify(user.password, password);
		if (!passwordRight) {
			throw new InvalidPasswordEmailException();
		}
		const payload: UserPayload = {
			userId: user.id,
			username: user.name,
			profileImgUrl: user.profileImgUrl,
			isAdmin: user.isAdmin,
		};

		return {
			accessToken: await this.tokenService.generateAccessToken(payload),
			refreshToken:
				await this.tokenService.generateAndStoreRefreshToken(payload),
		};
	}

	async logout(token: string) {
		const payload = (await this.tokenService.getTokenPayload(
			token,
		));

		return this.tokenService.deleteRefreshToken(payload.userId);
	}
}
