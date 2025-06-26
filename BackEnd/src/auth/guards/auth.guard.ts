import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromCookie(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: jwtConstants.secret,
			});

			request['user'] = payload;
		} catch (e) {
			console.log(e);
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromCookie(req: Request) {
		const token = req.cookies['access_token'];
		if (!token) {
			return undefined;
		} else {
			return token;
		}
	}
}
