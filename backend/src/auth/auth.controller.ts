import {
	Controller,
	Delete,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { createUserDto } from 'src/user/dtos/user.dto';
import { LoginDto } from 'src/user/dtos/login.dto';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { TokenService } from './token.service';
import { extractTokenFromCookie } from 'src/utils/jwt.util';
import { AuthGuard } from './guards/auth.guard';
import { LoginGoogleDto } from './dtos/loginGoogle.dto';
import { GoogleAuthService } from './googleAuth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private tokenService: TokenService,
		private googleAuthService: GoogleAuthService,
	) {}

	@Post('register')
	async createUser(@Body() body: createUserDto) {
		return this.authService.register(body);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	async loginUser(
		@Body() body: LoginDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const data = await this.authService.login(body);

		const isProduction =
			process.env.NODE_ENV === 'production' ? true : false;

		res.cookie('refresh_token', data.refreshToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: 15 * 24 * 60 * 60 * 1000,
		});
		res.cookie('access_token', data.accessToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: 15 * 60 * 1000,
		});
		return data;
	}

	@UseGuards(AuthGuard)
	@Delete('logout')
	async logoutUser(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const token = extractTokenFromCookie(req, 'access_token');

		const isProduction = process.env.NODE_ENV === 'production';

		this.authService.logout(token);

		res.clearCookie('refresh_token', {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
		});

		res.clearCookie('access_token', {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
		});

		return {
			message: 'Logged out successfully',
		};
	}

	@Post('refresh')
	async refreshToken(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const token = extractTokenFromCookie(req, 'refresh_token');

		if (!token) throw new UnauthorizedException('Token not found.');

		const data = await this.tokenService.refresh(token);

		const isProduction = process.env.NODE_ENV === 'production';

		res.cookie('refresh_token', data.refreshToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: 15 * 24 * 60 * 60 * 1000,
		});

		res.cookie('access_token', data.accessToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: 15 * 60 * 1000,
		});

		return data;
	}

	@Post('login/google')
	async loginGoogle(@Body() loginGoogleDto: LoginGoogleDto) {
		return this.googleAuthService.loginWithGoogle(loginGoogleDto.idToken);
	}
}
