import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import { createUserDto } from 'src/user/dtos/user.dto';
import { LoginDto } from 'src/user/dtos/login.dto';
import * as argon2 from 'argon2';
import { UniqueConstraintException } from 'src/exceptions/uniqueContraint.exception';
import { InvalidPasswordEmailException } from 'src/exceptions/InvalidPasswordEmail.exception';
import { UserPayload } from '../interfaces/userPayload.interface';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private tokenService: TokenService,
	) {}

	async register(body: createUserDto) {
		try {
			const data = {
				...body,
				password: await argon2.hash(body.password),
			};
			return await this.usersService.createUser(data);
		} catch (err) {
			if (err.name == 'SequelizeUniqueConstraintError') {
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
		const payload = await this.tokenService.getTokenPayload(token);

		return this.tokenService.deleteRefreshToken(payload.userId);
	}
}
