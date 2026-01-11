import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class GlobalFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    const logPayload = {
      level: 'error',
      statusCode: status,
      method: request.method,
      path: request.url,
      message,
      timestamp: new Date().toISOString(),
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };

    if(status >= 500) {
      this.logger.error(logPayload);
    }else if(status >= 400) {
      this.logger.warn(logPayload);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: logPayload.timestamp,
      path: request.url,
      message,
    });
  }
}
