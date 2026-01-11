import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { Request, Response } from 'express';
import {
  httpRequestsTotal,
  httpRequestDuration,
  httpRequestsInProgress,
  httpRequestSize,
  httpResponseSize,
} from 'src/metrics/metrics';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const method = req.method;
    const route = req.route?.path || req.originalUrl;

    // Active requests
    httpRequestsInProgress.inc({ method, route });

    // Request size (Content-Length header)
    if (req.headers['content-length']) {
      httpRequestSize.observe(
        { method, route },
        parseInt(req.headers['content-length'], 10)
      );
    }

    return next.handle().pipe(
      tap((data) => {
        // Response size (if content-length exists)
        if (res.getHeader('content-length')) {
          httpResponseSize.observe(
            { method, route, status: res.statusCode },
            parseInt(res.getHeader('content-length') as string, 10)
          );
        }
      }),
      finalize(() => {
        const duration = Date.now() - now;

        // Total requests
        httpRequestsTotal.inc({ method, route, status: res.statusCode });

        // Request duration
        httpRequestDuration.observe(
          { method, route, status: res.statusCode },
          duration
        );

        // Decrement active requests
        httpRequestsInProgress.dec({ method, route });
      })
    );
  }
}
