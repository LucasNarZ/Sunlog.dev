import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { jwtConstants } from 'src/constants';
import { RedisModule } from 'src/redis/redis.module';
import { GoogleAuthService } from './googleAuth.service';
import { EmailModule } from 'src/email/email.module';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: jwtConstants.accessSecret,
			signOptions: { expiresIn: '15m' },
		}),
		RedisModule,
		EmailModule,
		RabbitmqModule,
	],
	controllers: [AuthController],
	providers: [AuthGuard, AdminGuard, AuthService, TokenService, GoogleAuthService],
	exports: [AuthService, AuthGuard, AdminGuard],
})
export class AuthModule {}
