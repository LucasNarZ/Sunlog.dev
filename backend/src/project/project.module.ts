import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { projectProviders } from './project.providers';
import { DatabaseModule } from 'src/database/database.module';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [DatabaseModule, WinstonModule],
  controllers: [ProjectController],
  providers: [ProjectService, ...projectProviders],
  exports: [ProjectService],
})
export class ProjectModule {}
