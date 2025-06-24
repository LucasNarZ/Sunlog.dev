import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/User/users.service';
import { createUserDto } from 'src/User/dtos/user.dto';
import { LoginDto } from 'src/User/dtos/login.dto';
import * as argon2 from "argon2";
import { UniqueConstraintException } from 'src/exceptions/uniqueContraint.exception';
import { InvalidPasswordEmailException } from 'src/exceptions/InvalidPasswordEmail.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(body:createUserDto) {
        console.log(body.password)
        try{
            let data = body
            data = {
                ...data,
                password: await argon2.hash(data.password)
            }
            return await this.usersService.createUser(data)
        }catch(err){
            if(err.name == 'SequelizeUniqueConstraintError'){
                throw new UniqueConstraintException("Email already registered.")
            }
        }
    }

    async login(body:LoginDto) {
        const { email, password } = body
        const user = await this.usersService.getUserByEmail(email)
        if(!user){
            console.log("user not found")
            throw new InvalidPasswordEmailException()
        }
        const passwordRight = await argon2.verify(user.password, password)
        if(!passwordRight){
            console.log(password)
            console.log("password not right")
            throw new InvalidPasswordEmailException()
        }
        const payload = {
            userId:user.id,
            username: user.name,
            profileImageUrl: user.profileImgUrl
        }

        return {
            accessToken: await this.jwtService.signAsync(payload)
        }
    }

}
