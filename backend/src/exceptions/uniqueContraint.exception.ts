import { HttpException, HttpStatus } from '@nestjs/common';

export class UniqueConstraintException extends HttpException {
	constructor(readonly message: string) {
		super(message, HttpStatus.BAD_REQUEST);
	}
}
