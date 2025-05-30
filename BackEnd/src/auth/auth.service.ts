import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/User/users.service';
import { createUserDto } from 'src/dtos/user.dto';
import { LoginDto } from 'src/dtos/login.dto';
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

    async login(body:LoginDto) {
        const { email, password } = body
        const user = await this.usersService.getUserByEmail(email)
        if(!user){
            throw new InvalidPasswordEmailException()
        }
        const passwordRight = await argon2.verify(user.password, password)
        if(!passwordRight){
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
