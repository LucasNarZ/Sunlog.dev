import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { logger } from "src/logger/logger";
import { httpRequestDuration, httpRequestsTotal } from "src/metrics/metrics";


@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now()

        res.on('finish', () => {
            const duration = Date.now() - start;

            logger.log('HTTP REQUEST', {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration,
            });

            httpRequestsTotal.inc({
                method: req.method,
                route: req.route?.path || req.originalUrl,
                status: res.statusCode,
            });

            httpRequestDuration.observe(
                {
                    method: req.method,
                    route: req.route?.path || req.originalUrl,
                    status: res.statusCode,
                },
                duration / 1000
            );

        });

        next()
    }
}