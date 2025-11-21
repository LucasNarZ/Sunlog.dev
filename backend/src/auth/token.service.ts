import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../interfaces/userPayload.interface';
import { jwtConstants, redisToken } from 'src/constants';
import Redis from 'ioredis';
import * as argon2 from 'argon2';

@Injectable()
export class TokenService {
	constructor(
		@Inject(redisToken)
		private redis: Redis,
		private jwtService: JwtService,
	) {}

	async generateAccessToken(payload: UserPayload) {
		return await this.jwtService.signAsync(payload, {
			expiresIn: '15m',
			secret: jwtConstants.accessSecret,
		});
	}

	private async storeRefreshTokenHash(
		userId: string,
		refreshTokenHash: string,
	) {
		return await this.redis.set(
			`refreshHash:${userId}`,
			refreshTokenHash,
			'EX',
			1296000,
		);
	}

	private async findByUser(userId: string) {
		return await this.redis.get(`refreshHash:${userId}`);
	}

	async generateAndStoreRefreshToken(payload: UserPayload) {
		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: '15d',
			secret: jwtConstants.refreshSecret,
		});

		const refreshTokenHash = await argon2.hash(refreshToken);

		await this.storeRefreshTokenHash(payload.userId, refreshTokenHash);

		return refreshToken;
	}

	async refresh(token: string) {
		console.log('refresh');
		const tokenPayload = await this.jwtService.verifyAsync(token, {
			secret: jwtConstants.refreshSecret,
			algorithms: ['HS256'],
		});

		const hash = await this.findByUser(tokenPayload.userId);

		if (!hash)
			throw new UnauthorizedException('Token not found or expired.');

		const tokenRight = await argon2.verify(hash, token);

		if (!tokenRight) throw new UnauthorizedException('Invalid token hash.');

		const payload: UserPayload = {
			userId: tokenPayload.userId,
			username: tokenPayload.username,
			profileImgUrl: tokenPayload.profileImgUrl,
			isAdmin: tokenPayload.isAdmin,
		};

		return {
			accessToken: await this.generateAccessToken(payload),
			refreshToken: await this.generateAndStoreRefreshToken(payload),
		};
	}
}
