# Sunlog.dev

Sunlog.dev is a full-stack platform for developers to publish projects, share devlog updates, and interact through comments, likes, follows, and moderation tools.

The repository is organized as a multi-service application with a Next.js frontend, a NestJS API, a NestJS worker, PostgreSQL, Redis, RabbitMQ, NGINX, and an observability stack.

## What It Includes

- User sign-up, sign-in, Google OAuth, and authenticated sessions
- User profiles and follow relationships
- Project creation and project-specific devlogs
- Comments and likes on devlog content
- Admin moderation for post status updates
- Background email/notification processing through RabbitMQ
- Metrics, dashboards, and container log aggregation for local and production environments

## Stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, MUI, Tailwind CSS |
| API | NestJS, Sequelize, PostgreSQL, Redis, JWT, Google OAuth |
| Worker | NestJS, RabbitMQ, Nodemailer |
| Infrastructure | Docker Compose, NGINX |
| Observability | Prometheus, Grafana, Loki, Promtail |

## Repository Layout

```text
backend/   NestJS REST API, database models, migrations, and tests
frontend/  Next.js web application
worker/    NestJS background worker for queued jobs
infra/     Docker Compose, NGINX, Prometheus, Grafana, and logging config
docs/      Architecture, code pattern, and testing documentation
scripts/   Operational scripts
```

## Prerequisites

- Node.js and npm
- Docker and Docker Compose
- Make

## Configuration

Create a local environment file from the example before starting the stack:

```bash
cp .env.example .env
```

Fill in the required values in `.env`, including PostgreSQL, Redis, RabbitMQ, JWT, Google OAuth, and SMTP settings. The Docker Compose commands load this file with `--env-file .env`.

## Quick Start

Install dependencies for all services:

```bash
npm run install-all
```

Start the development stack:

```bash
make dev-up
```

Run database migrations from the backend service:

```bash
cd backend
npx sequelize-cli db:migrate
```

Open the local services:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost` |
| Backend API | `http://localhost/api` |
| API docs | `http://localhost/api/docs` |
| Grafana | `http://localhost/grafana/` |

Stop the development stack:

```bash
make dev-down
```

Follow container logs:

```bash
make dev-logs
```

## Development Commands

Root-level commands:

```bash
npm run install-all
npm run start:dev
npm run test
npm run test:build
```

Service-level commands:

| Service | Command | Purpose |
| --- | --- | --- |
| `frontend` | `npm run dev` | Start Next.js on port `3000` |
| `frontend` | `npm run build` | Build the web app |
| `frontend` | `npm run lint` | Run ESLint |
| `backend` | `npm run start:dev` | Start the API in watch mode |
| `backend` | `npm run test` | Run API unit tests |
| `backend` | `npm run test:e2e` | Run API e2e tests |
| `worker` | `npm run start:dev` | Start the worker in watch mode |
| `worker` | `npm run test` | Run worker tests |

## Architecture

Requests enter through NGINX. Frontend traffic is proxied to the Next.js service, API traffic under `/api/` is proxied to the NestJS backend, and Grafana is served under `/grafana/`.

The backend owns the REST API, validation, authentication, database access, Redis integration, RabbitMQ publishing, logging, metrics, and Swagger documentation. The worker consumes RabbitMQ jobs and handles asynchronous email/notification work. PostgreSQL stores application data, Redis supports cache/session-related infrastructure, and Prometheus/Grafana/Loki/Promtail provide metrics and logs.

For deeper details, see:

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/code-patterns.md`](docs/code-patterns.md)
- [`docs/testing-patterns.md`](docs/testing-patterns.md)

## Production Helpers

The Makefile includes production-oriented Docker Compose helpers:

```bash
make prod-build
make prod-up
make prod-logs
make prod-down
make prod-pull
```

These commands use `infra/docker-compose.yml` with `infra/docker-compose.prod.yml` and the root `.env` file.

## License

The root package declares this project under the ISC license.
