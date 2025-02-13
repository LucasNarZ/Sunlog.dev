import { Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { createUserDto } from "src/dtos/user.dto";

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get("user")
    async findUsers() {  
        return await this.usersService.findAll()
    }

    @Post("user")
    async createUser(body:createUserDto) {
        return await this.usersService.createUser(body)
    }
}