import { OAuth2Client } from 'google-auth-library';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { UserPayload } from '../interfaces/userPayload.interface';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class GoogleAuthService {
	private client: OAuth2Client;

	constructor(
		private readonly tokenService: TokenService,
		private readonly userService: UsersService,
	) {
		this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
			throw new UnauthorizedException('Invalid Google token.');
		}

		if (!payload)
			throw new UnauthorizedException('Google token payload missing');

		let user = await this.userService.findByGoogleId(payload.sub);
		if (!user) {
			user = await this.userService.createUserGoogle({
				googleId: payload.sub,
				email: payload.email,
				name: payload.name,
			});
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

		return { accessToken, refreshToken, user };
	}
}
