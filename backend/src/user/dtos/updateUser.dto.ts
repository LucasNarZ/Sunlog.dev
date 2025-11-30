import { IsString, IsNotEmpty } from 'class-validator';

export class updateUserDto {
	@IsString()
	@IsNotEmpty()
	readonly name: string;

	@IsString()
	readonly bio: string;

	@IsString()
	@IsNotEmpty()
	readonly profileImgUrl: string;
}
