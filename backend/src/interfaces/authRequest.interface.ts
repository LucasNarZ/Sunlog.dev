import { Request } from 'express';
import { UserPayload } from './userPayload.interface';

export interface AuthRequest extends Request {
	user: UserPayload;
}
