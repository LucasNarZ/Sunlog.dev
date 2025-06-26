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

@Module({
	imports: [DatabaseModule, PostsModule, UsersModule, AuthModule],
	controllers: [AppController, PostsController, UsersController],
	providers: [
		AppService,
		PostsService,
		...postsProviders,
		UsersService,
		...usersProviders,
	],
})
export class AppModule {}
