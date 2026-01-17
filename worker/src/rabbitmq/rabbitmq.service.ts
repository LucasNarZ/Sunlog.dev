import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL;
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
  }

  async consume(queue: string, callback: (msg: any) => Promise<void>) {
    await this.channel.assertQueue(queue, { durable: true });

    this.channel.consume(queue, async (msg: any) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());

        await callback(content);

        this.channel.ack(msg);
      } catch (err) {
        console.error(err);
        this.channel.nack(msg, false, false);
      }
    });
  }
}
