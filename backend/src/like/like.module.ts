import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { likeProviders } from './like.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [LikeController],
    providers: [LikeService, ...likeProviders],
})
export class LikeModule {}
