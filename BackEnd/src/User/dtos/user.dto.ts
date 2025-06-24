import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class createUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name:string;

    @IsEmail()
    @IsNotEmpty()
    readonly email:string;

    @IsString()
    @IsNotEmpty()
    readonly password:string;
}