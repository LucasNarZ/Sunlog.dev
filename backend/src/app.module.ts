import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DevlogEventsModule } from './devlog-event/devlog-event.module';
import { DevlogEventsController } from './devlog-event/devlog-event.controller';
import { DevlogEventsService } from './devlog-event/devlog-event.service';
import { devlogEventsProviders } from './devlog-event/devlog-event.providers';
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
import { CommentService } from './comment/comment.service';
import { commentProviders } from './comment/comment.providers';
import { CommentController } from './comment/comment.controller';
import { CommentModule } from './comment/comment.module';
import { ProjectModule } from './project/project.module';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { projectProviders } from './project/project.providers';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { LoggerModule } from './logger/logger.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
	imports: [
		DatabaseModule,
		RedisModule,
		AdminModule,
		DevlogEventsModule,
		UsersModule,
		AuthModule,
		FollowModule,
		LikeModule,
		CommentModule,
		ProjectModule,
		LoggerModule,
		MetricsModule,
	],
	controllers: [
		AppController,
		AdminController,
		DevlogEventsController,
		UsersController,
		FollowController,
		LikeController,
		CommentController,
		ProjectController
	],
	providers: [
		AppService,
		AdminService,
		...adminProviders,
		DevlogEventsService,
		...devlogEventsProviders,
		UsersService,
		...usersProviders,
		FollowService,
		...followProviders,
		LikeService,
		...likeProviders,
		CommentService,
		...commentProviders,
		ProjectService,
		...projectProviders
	],
})
export class AppModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}
