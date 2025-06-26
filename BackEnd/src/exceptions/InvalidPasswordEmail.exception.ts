import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordEmailException extends HttpException {
	constructor() {
		super('Invalid Email or Password', HttpStatus.UNAUTHORIZED);
	}
}
