# Sunlog.dev

A full-stack platform where developers can create projects, share development updates (devlogs), and interact with other users through comments, likes, and follows.

This system is designed with **scalability, observability, and production-ready architecture** in mind.

---

## ✨ Features

### Core Features

* User authentication (including Google OAuth)
* User profiles
* Create and manage projects
* Publish devlogs linked to projects
* Comment on posts
* Like posts
* Follow other users
* Admin area for moderation
* Email and notification processing in background jobs

### Technical Highlights

* REST API built with **NestJS**
* Frontend built with **Next.js**
* Asynchronous processing with **RabbitMQ**
* Caching layer with **Redis**
* Background worker service
* PostgreSQL (via migrations and structured schema)

---

## 🏗 Architecture Overview

The system is divided into multiple services:

* **Frontend** – Next.js application (SSR-ready)
* **Backend API** – Main REST API (NestJS)
* **Worker** – Background job processor (emails, async tasks)
* **Redis** – Caching layer
* **RabbitMQ** – Message broker for async communication
* **NGINX** – Reverse proxy (production)
* **Monitoring Stack**

  * Prometheus (metrics)
  * Grafana (dashboards)
  * Loki + Promtail (logs)

---

## 🐳 Running Locally (Development)

Make sure you have **Node.js** and **npm** installed.

First, create your environment file based on the provided example.

Start the development containers (database, redis, rabbitmq, etc.):

```bash
make dev-up
```

With the containers running, install backend dependencies and execute the database migrations:

```bash
cd backend
npm install
npx sequelize-cli db:migrate
cd ..
```

Services will be available:

* Frontend: [http://localhost](http://localhost)
* Backend API: [http://localhost/api](http://localhost:3001/api)
* Grafana: [http://localhost/grafana/](http://localhost/grafana/)

---

## 🧪 Testing

Backend include automated tests.

Run inside each service folder:

```bash
npm install
npm run test
```

---

## 📊 Observability

The platform includes built-in monitoring and logging:

* **Prometheus** collects application and database metrics
* **Grafana** provides dashboards for HTTP and DB metrics
* **Loki** aggregates logs from all services

This allows real-time insight into system health and performance.

---

## 🔒 Security

* JWT-based authentication
* OAuth login with Google
* Route protection via guards and decorators
* Centralized error handling and validation
* Indexed database queries for performance and abuse mitigation

---

## 📁 Project Structure

```
backend/    → Main API (NestJS)
frontend/   → Web app (Next.js)
worker/     → Background job processor
infra/      → Terraform, Docker Compose, NGINX, and observability assets
scripts/    → Deployment and startup scripts
```

---

## 📜 License

This project is licensed under the terms of the MIT License.

