import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleDestroy {
	private connection: amqp.ChannelModel | null = null;
	private channel: amqp.Channel | null = null;
	private readonly logger = new Logger(RabbitmqService.name);

	private async connect() {
		if (this.channel) {
			return this.channel;
		}

		const url = process.env.RABBITMQ_URL;

		if (!url) {
			throw new Error('RABBITMQ_URL is not configured.');
		}

		this.connection = await amqp.connect(url);
		this.channel = await this.connection.createChannel();

		return this.channel;
	}

	async publish(queue: string, payload: unknown) {
		const channel = await this.connect();

		await channel.assertQueue(queue, { durable: true });

		channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
			persistent: true,
		});
	}

	async onModuleDestroy() {
		try {
			await this.channel?.close();
			await this.connection?.close();
		} catch (error) {
			this.logger.error(
				'Failed to close RabbitMQ connection.',
				error instanceof Error ? error.stack : String(error),
			);
		}
	}
}
