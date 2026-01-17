import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdatePostStatusDto {
	@IsNotEmpty()
	@IsString()
	@IsIn(['APPROVED', 'REJECTED', 'PENDENT'])
	status: string;
}
