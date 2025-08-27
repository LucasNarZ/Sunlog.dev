
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FollowService } from './follow.service';
import { followProviders } from './follow.providers';
import { FollowController } from './follow.controller';

@Module({
	imports: [DatabaseModule],
	controllers: [FollowController],
	providers: [FollowService, ...followProviders],
	exports: [FollowService],
})
export class FollowModule {}
