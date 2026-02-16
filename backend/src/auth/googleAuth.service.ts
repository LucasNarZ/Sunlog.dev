import { OAuth2Client } from 'google-auth-library';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { UserPayload } from '../interfaces/userPayload.interface';
import { UsersService } from 'src/user/users.service';
import { logger } from 'src/logger/logger';

@Injectable()
export class GoogleAuthService {
	private client: OAuth2Client;

	constructor(
		private readonly tokenService: TokenService,
		private readonly userService: UsersService,
	) {
		const certsUrl = 'http://nginx/google-certs/';

		this.client = new OAuth2Client({
			clientId: process.env.GOOGLE_CLIENT_ID,
			endpoints: {
				oauth2FederatedSignonPemCertsUrl: certsUrl,
			},
		});
	}

	async loginWithGoogle(idToken: string) {
		let payload;

		try {
			const ticket = await this.client.verifyIdToken({
				idToken,
				audience: process.env.GOOGLE_CLIENT_ID,
			});

			payload = ticket.getPayload();
		} catch (err) {
			logger.error('Error during token verification:');
			logger.error(err);

			throw new UnauthorizedException('Invalid Google token.');
		}

		let user = await this.userService.findByGoogleId(payload.sub);

		if (!user) {
			const existingUser = await this.userService.getUserByEmail(
				payload.email,
			);

			if (existingUser) {
				await this.userService.linkGoogleAccount(
					existingUser.id,
					payload.sub,
				);
				user = await this.userService.findByGoogleId(payload.sub);
			} else {
				user = await this.userService.createUserGoogle({
					googleId: payload.sub,
					email: payload.email,
					name: payload.name,
				});
			}
		} else {
			logger.log(`Existing user found: ${user.id}`);
		}

		if (!user) {
			throw new UnauthorizedException('User not found after Google login.');
		}

		const jwtPayload: UserPayload = {
			userId: user.id,
			username: user.name,
			profileImgUrl: user.profileImgUrl,
			isAdmin: user.isAdmin ?? false,
		};

		const accessToken =
			await this.tokenService.generateAccessToken(jwtPayload);
		const refreshToken =
			await this.tokenService.generateAndStoreRefreshToken(jwtPayload);

		return { accessToken, refreshToken };
	}
}
