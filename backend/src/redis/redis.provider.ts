import Redis from 'ioredis';
import { redisToken } from 'src/constants';

export const RedisProviders = [
	{
		provide: redisToken,
		useFactory: () => {
			return new Redis({
				host: 'redis',
				port: Number(process.env.REDIS_PORT) || 6379,
				password: process.env.REDIS_PASSWORD,
			});
		},
	},
];
