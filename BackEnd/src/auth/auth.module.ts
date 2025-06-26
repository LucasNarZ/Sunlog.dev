import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/User/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { UsersService } from 'src/User/users.service';

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '1h' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
