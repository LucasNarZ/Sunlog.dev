import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidPasswordEamilException extends HttpException {
    constructor () {
        super("Invalid Email or Password", HttpStatus.UNAUTHORIZED)
    }
}