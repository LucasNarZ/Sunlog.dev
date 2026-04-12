import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthRequest } from 'src/interfaces/authRequest.interface';

@Injectable()
export class AdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest<AuthRequest>();
		const user = req.user;

		return Boolean(user && user.isAdmin === true);
	}
}
