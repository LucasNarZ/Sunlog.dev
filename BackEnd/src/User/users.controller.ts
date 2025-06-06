import { Controller, Get, Body, Req, Put, BadRequestException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request } from "express";
import { updateUserDto } from "src/dtos/updateUser.dto";
import { UserNotFoundException } from "src/exceptions/UserNotFound.exception";
import { validate as isUuid } from "uuid"

@Controller("user")
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    async findUsers() {  
        return await this.usersService.findAll()
    }

    @Get(":id")
    async findUser(@Req() req:Request) {
        const { id } = req.params
        if(!isUuid(id)){
            throw new BadRequestException("Invalid userId")
        }
        const user = await this.usersService.findUser(id)
        if(!user){
            throw new UserNotFoundException(`user with id ${id} not found`)
        }
        return user
    }

    @Put(":id")
    async updateUser(@Req() req:Request, @Body() body:updateUserDto) {
        const { id } = req.params
        let user = await this.usersService.findUser(id)
        if(!user){
            throw new UserNotFoundException(`user with id ${id} not found`)
        }
        user = await user.update(body)
        return user
    }

    @Get(":id/posts")
    async getUserPosts(@Req() req:Request) {
        const { id } = req.params;
        const posts = await this.usersService.getPostByUser(id)
        
    }

}