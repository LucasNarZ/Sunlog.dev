import { IsNotEmpty, IsString } from 'class-validator';

export class LikeDevlogEventDto {
	@IsString()
	@IsNotEmpty()
	likedId: string;
}
