import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createDevlogEventDto {
	@IsString()
	@IsNotEmpty()
	readonly summary: string;
	@IsString()
	@IsOptional()
	readonly content: string;
}
