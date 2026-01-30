import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { AuthGuard } from './guards/auth.guard';
import { jwtConstants } from 'src/constants';
import { RedisModule } from 'src/redis/redis.module';
import { GoogleAuthService } from './googleAuth.service';

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: jwtConstants.accessSecret,
			signOptions: { expiresIn: '15m' },
		}),
		RedisModule,
	],
	controllers: [AuthController],
	providers: [AuthGuard, AuthService, TokenService, GoogleAuthService],
	exports: [AuthService],
})
export class AuthModule {}
