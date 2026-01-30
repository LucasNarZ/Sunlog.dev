import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class createUserGoogleDto {
	@IsString()
	@IsNotEmpty()
	readonly name: string;

	@IsEmail()
	@IsNotEmpty()
	readonly email: string;

	@IsString()
	@IsNotEmpty()
	readonly googleId: string;
}
