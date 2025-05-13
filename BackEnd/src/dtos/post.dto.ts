import { IsArray, IsNotEmpty, IsString, IsOptional } from "class-validator"

export class createPostDto {
    @IsString()
    @IsNotEmpty()
    readonly title:string;
    @IsString()
    @IsNotEmpty()
    readonly content: string;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly description?: string;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly previewImgUrl?: string;
    @IsString()
    @IsNotEmpty()
    readonly authorId:string;
    @IsArray()
    @IsOptional()
    @IsString({each:true})
    readonly categorys?:string[];
    @IsArray()
    @IsOptional()
    @IsString({each:true})
    readonly tags?:string[];
}