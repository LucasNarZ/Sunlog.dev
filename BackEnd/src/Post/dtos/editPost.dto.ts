import { IsString, IsNotEmpty } from 'class-validator';

export class EditPostDto {
	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@IsString()
	@IsNotEmpty()
	readonly description: string;

	@IsString()
	@IsNotEmpty()
	readonly content: string;
}
