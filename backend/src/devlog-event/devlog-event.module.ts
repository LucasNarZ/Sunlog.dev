import { Module } from '@nestjs/common';

import { DevlogEventsController } from './devlog-event.controller';
import { DevlogEventsService } from './devlog-event.service';
import { DatabaseModule } from 'src/database/database.module';
import { devlogEventsProviders } from './devlog-event.providers';

@Module({
	imports: [DatabaseModule],
	controllers: [DevlogEventsController],
	providers: [DevlogEventsService, ...devlogEventsProviders],
})
export class DevlogEventsModule {}
