import { Module } from '@nestjs/common';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { EmailModule } from './email/email.module';
import { SendEmailConsumer } from './consumers/send-email.consumer';

@Module({
  imports: [RabbitmqModule, EmailModule],
  providers: [SendEmailConsumer],
})
export class AppModule {}
