import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './Post/posts.module';
import { PostsController } from './Post/posts.controller';
import { PostsService } from './Post/posts.service';
import { postsProviders } from './Post/posts.providers';
import { UsersController } from './User/users.controller';
import { UsersModule } from './User/users.module';
import { UsersService } from './User/users.service';
import { usersProviders } from './User/users.providers';

@Module({
  imports: [
    DatabaseModule,
    PostsModule,
    UsersModule
  ],
  controllers: [
    AppController,
    PostsController,
    UsersController
  ],
  providers: [
    AppService,
    PostsService,
    ...postsProviders,
    UsersService,
    ...usersProviders
  ],
})
export class AppModule {}
