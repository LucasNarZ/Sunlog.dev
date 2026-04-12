import { OnModuleInit, Injectable } from '@nestjs/common';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { EmailService } from '../email/email.service';

type SendEmailPayload = {
  to: string;
  subject: string;
  body: string;
};

@Injectable()
export class SendEmailConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitqm: RabbitmqService,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit() {
    const queue = process.env.EMAIL_QUEUE || 'send-email';

    await this.rabbitqm.consume<SendEmailPayload>(queue, async (payload) => {
      const { to, subject, body } = payload;
      await this.emailService.sendEmail(to, subject, body);
    });
  }
}
