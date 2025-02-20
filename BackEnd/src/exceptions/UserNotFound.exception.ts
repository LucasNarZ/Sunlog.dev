import { HttpException, HttpStatus } from "@nestjs/common";


export class UserNotFoundException extends HttpException {
    constructor(
        readonly message:string
    ) {
        super(message, HttpStatus.NOT_FOUND)
    }
}