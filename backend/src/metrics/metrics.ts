import { Counter, Gauge, Histogram } from 'prom-client';

// Total requests by method, route and status
export const httpRequestsTotal = new Counter({
	name: 'http_requests_total',
	help: 'Total HTTP requests',
	labelNames: ['method', 'route', 'status'],
});

// Request duration in ms
export const httpRequestDuration = new Histogram({
	name: 'http_request_duration_ms',
	help: 'HTTP request duration in milliseconds',
	labelNames: ['method', 'route', 'status'],
	buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000],
});

// Active requests
export const httpRequestsInProgress = new Gauge({
	name: 'http_requests_in_progress',
	help: 'Number of active HTTP requests',
	labelNames: ['method', 'route'],
});

// Request size in bytes
export const httpRequestSize = new Histogram({
	name: 'http_request_size_bytes',
	help: 'HTTP request size in bytes',
	labelNames: ['method', 'route'],
	buckets: [100, 500, 1000, 5000, 10000, 50000, 100000],
});

// Response size in bytes
export const httpResponseSize = new Histogram({
	name: 'http_response_size_bytes',
	help: 'HTTP response size in bytes',
	labelNames: ['method', 'route', 'status'],
	buckets: [100, 500, 1000, 5000, 10000, 50000, 100000],
});

export const dbQueryTotal = new Counter({
	name: 'db_query_total',
	help: 'Total database queries executed',
	labelNames: ['model', 'type'],
});

export const dbQueryDuration = new Histogram({
	name: 'db_query_duration_seconds',
	help: 'Database query execution duration',
	labelNames: ['model', 'type'],
	buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2],
});

export const dbConnections = new Gauge({
	name: 'db_connections',
	help: 'Open database connections',
});

export const dbIdleConnections = new Gauge({
	name: 'db_idle_connections',
	help: 'Idle database connections',
});

export const dbErrorsTotal = new Counter({
	name: 'db_errors_total',
	help: 'Total database query errors',
	labelNames: ['model', 'type'],
});
