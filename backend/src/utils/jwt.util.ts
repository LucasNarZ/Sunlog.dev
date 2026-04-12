import { Request } from 'express';

function getCookieValue(
	cookies: unknown,
	cookieName: string,
): string | undefined {
	if (!cookies || typeof cookies !== 'object') {
		return undefined;
	}

	const value = (cookies as Record<string, unknown>)[cookieName];

	return typeof value === 'string' ? value : undefined;
}

export function extractTokenFromCookie(
	req: Request,
	cookieName: string,
): string | undefined {
	const token = getCookieValue(req.cookies as unknown, cookieName);

	if (!token) {
		return undefined;
	}

	return token;
}
