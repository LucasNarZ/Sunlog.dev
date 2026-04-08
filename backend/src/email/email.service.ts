import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name);

	constructor(private readonly rabbitmqService: RabbitmqService) {}

	async sendWelcomeEmail(user: User) {
		const queue = process.env.EMAIL_QUEUE || 'send-email';

		try {
			await this.rabbitmqService.publish(queue, {
				to: user.email,
				subject: 'Welcome to Sunlog.dev',
				body: this.getWelcomeEmailBody(user.name),
			});
		} catch (error) {
			this.logger.error(
				`Failed to enqueue welcome email for ${user.email}.`,
				error instanceof Error ? error.stack : String(error),
			);
		}
	}

	private getWelcomeEmailBody(name: string) {
		return `
			<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
				<h1>Welcome to Sunlog.dev, ${name}!</h1>
				<p>Your account is ready.</p>
				<p>Share your projects, publish devlogs, and connect with other builders.</p>
				<p>
					<a href="https://sunlog.dev" style="color: #2563eb;">Open Sunlog.dev</a>
				</p>
			</div>
		`;
	}
}
