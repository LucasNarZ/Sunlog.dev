import { Request } from 'express';

export function extractTokenFromCookie(req: Request, cookieName: string) {
	const token = req.cookies[cookieName];
	if (!token) {
		return undefined;
	} else {
		return token;
	}
}
