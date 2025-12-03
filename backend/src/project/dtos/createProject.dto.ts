import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
	@IsString()
	@IsNotEmpty()
	readonly name: string;
}
