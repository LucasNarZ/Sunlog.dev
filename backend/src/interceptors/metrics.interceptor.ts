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

type MetricsRequest = Request & {
	route?: unknown;
};

function getRoutePath(request: MetricsRequest): string {
	if (!request.route || typeof request.route !== 'object') {
		return request.originalUrl;
	}

	const path = (request.route as { path?: unknown }).path;

	return typeof path === 'string' ? path : request.originalUrl;
}

function getHeaderValue(value: string | string[] | number | undefined): string | undefined {
	if (typeof value === 'string') {
		return value;
	}

	if (Array.isArray(value)) {
		return value[0];
	}

	if (typeof value === 'number') {
		return String(value);
	}

	return undefined;
}

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const now = Date.now();
		const req = context.switchToHttp().getRequest<MetricsRequest>();
		const res = context.switchToHttp().getResponse<Response>();

		const method = req.method;
		const route = getRoutePath(req);

		// Active requests
		httpRequestsInProgress.inc({ method, route });

		// Request size (Content-Length header)
		const requestContentLength = getHeaderValue(req.headers['content-length']);

		if (requestContentLength) {
			httpRequestSize.observe(
				{ method, route },
				parseInt(requestContentLength, 10),
			);
		}

		return next.handle().pipe(
			tap(() => {
				// Response size (if content-length exists)
				const responseContentLength = getHeaderValue(
					res.getHeader('content-length'),
				);

				if (responseContentLength) {
					httpResponseSize.observe(
						{ method, route, status: res.statusCode },
						parseInt(responseContentLength, 10),
					);
				}
			}),
			finalize(() => {
				const duration = Date.now() - now;

				// Total requests
				httpRequestsTotal.inc({
					method,
					route,
					status: res.statusCode,
				});

				// Request duration
				httpRequestDuration.observe(
					{ method, route, status: res.statusCode },
					duration,
				);

				// Decrement active requests
				httpRequestsInProgress.dec({ method, route });
			}),
		);
	}
}
