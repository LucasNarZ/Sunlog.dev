import { Global, Module } from '@nestjs/common'
import { WinstonLoggerProvider } from './logger.provider'

@Global()
@Module({
  providers: [WinstonLoggerProvider],
  exports: [WinstonLoggerProvider],
})
export class LoggerModule {}
