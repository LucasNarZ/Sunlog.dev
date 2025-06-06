import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class EditPostDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    title?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    content?: string;
}