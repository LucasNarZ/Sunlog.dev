import {
	IsNotEmpty,
	IsString,
	MinLength,
	MaxLength,
	IsOptional,
	Matches,
} from 'class-validator';

export class CreateProjectDto {
	@IsString()
	@MinLength(3)
	@MaxLength(60)
	@Matches(/^[^/\\]+$/, {
		message: "Name cannot contain '/' or '\\'",
	})
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	content?: string;
}
