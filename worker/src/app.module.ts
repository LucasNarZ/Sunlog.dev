import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [RabbitmqModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
