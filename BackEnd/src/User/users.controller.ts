import { Controller, Get, Post, Body, Req, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { createUserDto } from "src/dtos/user.dto";
import * as argon2 from "argon2"
import { UniqueConstraintException } from "src/exceptions/uniqueContraint.exception";
import { LoginDto } from "src/dtos/login.dto";
import { InvalidPasswordEmailException } from "src/exceptions/InvalidPasswordEmail.exception";
import { Request } from "express";
import { updateUserDto } from "src/dtos/updateUser.dto";
import { UserNotFoundException } from "src/exceptions/UserNotFound.exception";

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
        const user = await this.usersService.findUser(id)
        if(!user){
            throw new UserNotFoundException(`user with id ${id} not found`)
        }
        return user
    }

    @Post("register")
    async createUser(@Body() body:createUserDto) {
        try{
            let data = body
            data = {
                ...data,
                password: await argon2.hash(data.password)
            }
            return await this.usersService.createUser(data)
        }catch(err:any){
            if(err.name == 'SequelizeUniqueConstraintError'){
                throw new UniqueConstraintException(err.errors[0].message)
            }
        }
    }

    @Post("login")
    async loginUser(@Req() req: Request, @Body() body:LoginDto) {

        const { email, password } = body
        const user = await this.usersService.getUserByEmail(email)
        if(!user){
            throw new InvalidPasswordEmailException()
        }
        const passwordRight = await argon2.verify(user.password, password)
        if(!passwordRight){
            throw new InvalidPasswordEmailException()
        }
        req.session.user = {email}

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
}