import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class createPostDto {
    @IsString()
    @IsNotEmpty()
    readonly title:string;
    @IsString()
    @IsNotEmpty()
    readonly content: string;
    @IsString()
    @IsNotEmpty()
    readonly author:string;
    @IsArray()
    @IsNotEmpty()
    @IsString({each:true})
    readonly categorys?:string[];
    @IsArray()
    @IsNotEmpty()
    @IsString({each:true})
    readonly tags?:string[];
}