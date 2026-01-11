import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

const isProd = process.env.NODE_ENV === 'production'

export const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: isProd
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              return `${timestamp} ${level}: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
              }`
            })
          ),
    }),
  ],
})
