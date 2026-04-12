import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { UserPayload } from 'src/interfaces/userPayload.interface';
import { extractTokenFromCookie } from 'src/utils/jwt.util';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<AuthRequest>();
		const token = extractTokenFromCookie(request, 'access_token');
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync<UserPayload>(token, {
				secret: jwtConstants.accessSecret,
				algorithms: ['HS256'],
			});

			request.user = payload;
		} catch (e) {
			console.log(e);
			throw new UnauthorizedException();
		}
		return true;
	}
}
