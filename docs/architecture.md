    # Architecture Overview

    ## System Architecture

    Sunlog.dev is a full-stack platform built with a microservices-inspired architecture, designed for scalability, observability, and maintainability.

    ## High-Level Architecture

    ```
    ┌─────────────┐
    │   Client    │
    │  (Browser)  │
    └──────┬──────┘
        │
        ▼
    ┌─────────────┐
    │    NGINX    │ ◄── Reverse Proxy & Load Balancer
    │  (Gateway)  │
    └──────┬──────┘
        │
        ├──────────────────┬──────────────────┐
        ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │  Frontend   │    │   Backend   │    │  Monitoring │
    │  (Next.js)  │    │  (NestJS)   │    │  (Grafana)  │
    └─────────────┘    └──────┬──────┘    └─────────────┘
                            │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │  PostgreSQL │    │    Redis    │    │  RabbitMQ   │
    │  (Database) │    │   (Cache)   │    │  (Queue)    │
    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                ▼
                                        ┌─────────────┐
                                        │   Worker    │
                                        │  (Node.js)  │
                                        └─────────────┘
    ```

    ## Core Components

    ### 1. Frontend (Next.js)
    - **Technology**: Next.js (React framework)
    - **Purpose**: Server-side rendered web application
    - **Features**:
    - SSR for improved SEO and performance
    - Google OAuth integration
    - Responsive UI for devlog creation and interaction

    **Key Directories:**
    ```
    frontend/
    ├── app/              # Next.js app directory
    ├── components/       # React components
    ├── lib/             # Utilities and helpers
    └── public/          # Static assets
    ```

    ### 2. Backend API (NestJS)
    - **Technology**: NestJS (Node.js framework)
    - **Purpose**: Main REST API server
    - **Port**: 3000 (internal), exposed via NGINX

    **Architecture Layers:**
    ```
    ┌─────────────────────────────────────┐
    │         Controllers Layer           │  ◄── HTTP endpoints
    ├─────────────────────────────────────┤
    │          Services Layer             │  ◄── Business logic
    ├─────────────────────────────────────┤
    │        Repositories Layer           │  ◄── Data access
    ├─────────────────────────────────────┤
    │         Database Layer              │  ◄── PostgreSQL
    └─────────────────────────────────────┘
    ```

    **Core Modules:**
    - **Auth**: Authentication (JWT, Google OAuth)
    - **User**: User management and profiles
    - **Project**: Project creation and management
    - **DevlogEvent**: Development log entries
    - **Comment**: Comment system
    - **Like**: Like functionality
    - **Follow**: User following system
    - **Admin**: Administrative functions

    ### 3. Worker Service
    - **Technology**: Node.js
    - **Purpose**: Background job processing
    - **Communication**: RabbitMQ message queue

    **Responsibilities:**
    - Email sending (SMTP)
    - Asynchronous task processing
    - Notification handling

    ### 4. Database (PostgreSQL)
    - **Version**: 16.3
    - **Purpose**: Primary data store
    - **Migration Tool**: Sequelize CLI

    **Schema Management:**
    ```bash
    # Run migrations
    npx sequelize-cli db:migrate

    # Create new migration
    npx sequelize-cli migration:generate --name migration-name
    ```

    **Key Tables:**
    - `Users` - User accounts and profiles
    - `Projects` - User projects
    - `DevlogEvents` - Development log entries
    - `Comments` - User comments
    - `Likes` - Like records
    - `Follows` - Follow relationships

    ### 5. Cache Layer (Redis)
    - **Version**: 8.4
    - **Purpose**: Caching and session storage

    **Use Cases:**
    - JWT refresh token storage
    - Session management
    - Query result caching
    - Rate limiting

    ### 6. Message Queue (RabbitMQ)
    - **Version**: 3 (with management plugin)
    - **Purpose**: Asynchronous communication

    **Message Patterns:**
    - Email notifications
    - Background job processing
    - Event-driven updates

    ### 7. Reverse Proxy (NGINX)
    - **Purpose**: Gateway and load balancer
    - **Configuration**: `nginx.dev.conf` / `nginx.prod.conf`

    **Routing:**
    ```
    /           → Frontend (Next.js)
    /api/*      → Backend API (NestJS)
    /grafana/*  → Grafana dashboards
    ```

    ## Observability Stack

    ### 1. Prometheus
    - **Purpose**: Metrics collection
    - **Metrics**:
    - HTTP request counts and latencies
    - Database query performance
    - System resource usage

    ### 2. Grafana
    - **Purpose**: Visualization and dashboards
    - **Dashboards**:
    - HTTP metrics dashboard
    - Database metrics dashboard
    - Custom application metrics

    **Access**: `http://localhost/grafana/`

    ### 3. Loki + Promtail
    - **Purpose**: Log aggregation and querying
    - **Features**:
    - Centralized logging from all services
    - Log correlation with metrics
    - Query and filter logs by service

    ## Data Flow

    ### 1. User Authentication Flow
    ```
    Client → NGINX → Backend
                        ↓
                Verify JWT
                        ↓
                Redis (check token)
                        ↓
                PostgreSQL (user data)
                        ↓
                Response → Client
    ```

    ### 2. Google OAuth Flow
    ```
    Client → Google OAuth
            ↓
        ID Token
            ↓
    Backend → Verify with Google
            ↓
        Check/Create User (PostgreSQL)
            ↓
        Generate JWT
            ↓
        Store Refresh Token (Redis)
            ↓
        Response → Client
    ```

    ### 3. Devlog Creation Flow
    ```
    Client → NGINX → Backend
                        ↓
                Validate (DTO)
                        ↓
                Auth Guard (JWT)
                        ↓
                Service Layer
                        ↓
                PostgreSQL (save)
                        ↓
                RabbitMQ (notify followers)
                        ↓
                Worker (send emails)
                        ↓
                Response → Client
    ```

    ## Security Architecture

    ### 1. Authentication
    - **JWT**: Access tokens (15 min) + Refresh tokens (15 days)
    - **OAuth**: Google OAuth 2.0 integration
    - **Storage**: 
    - Access tokens: HTTP-only cookies
    - Refresh tokens: Redis + HTTP-only cookies

    ### 2. Authorization
    - **Guards**: NestJS guards for route protection
    - **Roles**: Admin flag in user payload
    - **Decorators**: Custom decorators for user context

    ### 3. Data Protection
    - **Password Hashing**: Argon2
    - **HTTPS**: Enforced in production
    - **CORS**: Configured for specific origins
    - **Cookie Security**: 
    - `httpOnly: true`
    - `secure: true` (production)
    - `sameSite: 'none'` (production) / `'lax'` (dev)

    ## Deployment Architecture

    ### Development Environment
    ```yaml
    # docker-compose.dev.yml
    services:
    - front-end (hot reload)
    - api (hot reload)
    - worker
    - postgres
    - redis
    - rabbitmq
    - nginx
    - prometheus
    - grafana
    - loki
    - promtail
    ```

    ### Production Environment
    ```yaml
    # docker-compose.prod.yml
    services:
    - front-end (optimized build)
    - api (optimized build)
    - worker
    - postgres (persistent volume)
    - redis (persistent volume)
    - rabbitmq (persistent volume)
    - nginx (SSL/TLS)
    - prometheus
    - grafana
    - loki
    - promtail
    ```

    ## Network Architecture

    ### Networks
    - **public**: External-facing services (NGINX, PostgreSQL port exposure)
    - **internal**: Internal service communication (isolated)

    ### Service Communication
    - Frontend ↔ Backend: HTTP via NGINX
    - Backend ↔ Database: TCP (PostgreSQL protocol)
    - Backend ↔ Redis: TCP (Redis protocol)
    - Backend ↔ RabbitMQ: AMQP
    - Worker ↔ RabbitMQ: AMQP

    ## Scalability Considerations

    ### Horizontal Scaling
    - **Frontend**: Multiple Next.js instances behind NGINX
    - **Backend**: Multiple NestJS instances with load balancing
    - **Worker**: Multiple worker instances consuming from RabbitMQ

    ### Vertical Scaling
    - **Database**: PostgreSQL connection pooling
    - **Redis**: Memory optimization and eviction policies
    - **RabbitMQ**: Queue management and prefetch settings

    ### Caching Strategy
    - **Redis**: Cache frequently accessed data
    - **Query Results**: Cache expensive database queries
    - **Session Data**: Store in Redis for fast access

    ## Monitoring and Alerting

    ### Metrics Collection
    - **Application Metrics**: Custom Prometheus metrics
    - **System Metrics**: CPU, memory, disk usage
    - **Database Metrics**: Query performance, connection pool

    ### Log Aggregation
    - **Structured Logging**: JSON format for easy parsing
    - **Centralized Storage**: Loki for all service logs
    - **Correlation**: Request IDs for tracing

    ### Dashboards
    - **HTTP Metrics**: Request rates, latencies, error rates
    - **Database Metrics**: Query performance, connection pool
    - **Custom Metrics**: Business-specific KPIs

    ## Technology Stack Summary

    | Layer | Technology | Version | Purpose |
    |-------|-----------|---------|---------|
    | Frontend | Next.js | Latest | Web application |
    | Backend | NestJS | Latest | REST API |
    | Database | PostgreSQL | 16.3 | Data persistence |
    | Cache | Redis | 8.4 | Caching & sessions |
    | Queue | RabbitMQ | 3 | Async messaging |
    | Proxy | NGINX | Latest | Reverse proxy |
    | Metrics | Prometheus | Latest | Metrics collection |
    | Visualization | Grafana | Latest | Dashboards |
    | Logs | Loki + Promtail | Latest | Log aggregation |
    | ORM | Sequelize | Latest | Database ORM |
    | Auth | JWT + OAuth2 | - | Authentication |
    | Password | Argon2 | Latest | Password hashing |

    ## Development Workflow

    ### Local Development
    1. Start services: `docker compose -f docker-compose.dev.yml up -d`
    2. Run migrations: `cd backend && npx sequelize-cli db:migrate`
    3. Access application: `http://localhost`
    4. Access Grafana: `http://localhost/grafana/`

    ### Database Migrations
    ```bash
    # Create migration
    npx sequelize-cli migration:generate --name add-field-to-table

    # Run migrations
    npx sequelize-cli db:migrate

    # Rollback migration
    npx sequelize-cli db:migrate:undo
    ```

    ### Testing
    ```bash
    # Backend tests
    cd backend && npm run test

    # Frontend tests
    cd frontend && npm run test
    ```

    ## Infrastructure as Code

    ### Terraform
    - **Location**: `infra/` directory
    - **Purpose**: Cloud infrastructure provisioning
    - **Resources**: Managed cloud resources for production deployment
