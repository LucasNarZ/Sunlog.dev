import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class createPostDto {
	@IsString()
	@IsNotEmpty()
	readonly title: string;
	@IsString()
	@IsNotEmpty()
	readonly content: string;
	@IsOptional()
	@IsString()
	readonly description?: string;
	@IsString()
	readonly slug: string;
	@IsOptional()
	@IsString()
	readonly previewImgUrl?: string;
	@IsString()
	@IsNotEmpty()
	readonly authorId: string;
	@IsString()
	@IsNotEmpty()
	readonly category: string;
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	readonly tags?: string[];
}
