import { Injectable, OnModuleInit } from '@nestjs/common';
import { Channel, ChannelModel, connect, ConsumeMessage } from 'amqplib';

type MessageHandler<T> = (msg: T) => Promise<void>;

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private connection!: ChannelModel;
  private channel!: Channel;

  async onModuleInit(): Promise<void> {
    const url = process.env.RABBITMQ_URL;

    if (!url) {
      throw new Error('RABBITMQ_URL is not defined');
    }

    this.connection = await connect(url);
    this.channel = await this.connection.createChannel();
  }

  async consume<T>(queue: string, callback: MessageHandler<T>): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });

    await this.channel.consume(queue, (msg: ConsumeMessage | null) => {
      if (!msg) return;

      void (async () => {
        try {
          const content = JSON.parse(msg.content.toString()) as T;

          await callback(content);

          this.channel.ack(msg);
        } catch (err) {
          console.error(err);
          this.channel.nack(msg, false, false);
        }
      })();
    });
  }
}
