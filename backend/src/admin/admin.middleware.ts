import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthRequest } from 'src/interfaces/authRequest.interface';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
	use(req: AuthRequest, res: Response, next: NextFunction) {
		const user = req.user;

		if (!user || !user.isAdmin) {
			return res
				.status(403)
				.json({
					message:
						'Not authorized: You need admin privilegies to access this route.',
				});
		}

		next();
	}
}
