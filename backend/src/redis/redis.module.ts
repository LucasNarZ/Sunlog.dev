import { Global, Module } from '@nestjs/common';
import { RedisProviders } from './redis.provider';

@Global()
@Module({
	providers: [...RedisProviders],
	exports: [...RedisProviders],
})
export class RedisModule {}
