import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AdminController } from './admin.controller';
import { adminProviders } from './admin.providers';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [DatabaseModule, AuthModule],
	controllers: [AdminController],
	providers: [AdminService, ...adminProviders],
	exports: [AdminService],
})
export class AdminModule {}
