import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AdminController } from './admin.controller';
import { adminProviders } from './admin.providers';
import { AdminService } from './admin.service';

@Module({
	imports: [DatabaseModule],
	controllers: [AdminController],
	providers: [AdminService, ...adminProviders],
	exports: [AdminService],
})
export class AdminModule {}
