import { Controller, Get, Post, Body, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { createUserDto } from "src/dtos/user.dto";
import * as argon2 from "argon2"
import { UniqueConstraintException } from "src/exceptions/uniqueContraint.exception";

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
                console.log(err)
                throw new UniqueConstraintException(err.errors[0].message)
            }
        }


    }

}