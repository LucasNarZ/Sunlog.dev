import { Controller, Get, Post, Body, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { createUserDto } from "src/dtos/user.dto";
import * as argon2 from "argon2"
import { UniqueConstraintException } from "src/exceptions/uniqueContraint.exception";
import { LoginDto } from "src/dtos/login.dto";
import { InvalidPasswordEmailException } from "src/exceptions/InvalidPasswordEmail.exception";
import { Request } from "express";

@Controller("user")
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get("user")
    async findUsers() {  
        return await this.usersService.findAll()
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
        }catch(err){
            if(err.name == 'SequelizeUniqueConstraintError'){
                throw new UniqueConstraintException(err.errors[0].message)
            }
        }
    }

    @Post("login")
    async loginUser(@Req() req: Request, @Body() body:LoginDto) {
        try {
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
        }catch(err){
            throw err
        }
    }
}