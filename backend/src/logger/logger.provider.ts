import { logger } from './logger'

export const WinstonLoggerProvider = {
  provide: 'LOGGER',
  useValue: logger
}
