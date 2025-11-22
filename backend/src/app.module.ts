import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './post/posts.module';
import { PostsController } from './post/posts.controller';
import { PostsService } from './post/posts.service';
import { postsProviders } from './post/posts.providers';
import { UsersController } from './user/users.controller';
import { UsersModule } from './user/users.module';
import { UsersService } from './user/users.service';
import { usersProviders } from './user/users.providers';
import { AuthModule } from './auth/auth.module';
import { FollowController } from './follow/follow.controller';
import { FollowService } from './follow/follow.service';
import { followProviders } from './follow/follow.providers';
import { FollowModule } from './follow/follow.module';
import { LikeService } from './like/like.service';
import { likeProviders } from './like/like.providers';
import { LikeController } from './like/like.controller';
import { LikeModule } from './like/like.module';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { adminProviders } from './admin/admin.providers';
import { RedisModule } from './redis/redis.module';

@Module({
	imports: [
		DatabaseModule,
		RedisModule,
		AdminModule,
		PostsModule,
		UsersModule,
		AuthModule,
		FollowModule,
		LikeModule,
	],
	controllers: [
		AppController,
		AdminController,
		PostsController,
		UsersController,
		FollowController,
		LikeController,
	],
	providers: [
		AppService,
		AdminService,
		...adminProviders,
		PostsService,
		...postsProviders,
		UsersService,
		...usersProviders,
		FollowService,
		...followProviders,
		LikeService,
		...likeProviders,
	],
})
export class AppModule {}
