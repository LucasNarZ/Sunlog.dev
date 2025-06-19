import { Controller, Res } from '@nestjs/common';
import { Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { createUserDto } from 'src/dtos/user.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post("register")
    async createUser(@Body() body:createUserDto) {
        return this.authService.register(body);
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async loginUser(@Body() body:LoginDto, @Res({ passthrough: true }) res: Response) {
        const data = await this.authService.login(body);
        res.cookie('access_token', data.accessToken, {
            httpOnly: true,
            secure: false, // modify later
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60, 
        })
        return data
    }
}
