import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './Post/posts.module';
import { PostsController } from './Post/posts.controller';
import { PostsService } from './Post/posts.service';
import { postsProviders } from './Post/posts.providers';

@Module({
  imports: [
    DatabaseModule,
    PostsModule
  ],
  controllers: [
    AppController,
    PostsController
  ],
  providers: [
    AppService,
    PostsService,
    ...postsProviders
  ],
})
export class AppModule {}
