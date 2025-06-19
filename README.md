# Energy ON IoT Backend

A backend service for the Energy ON IoT platform, enabling device management, telemetry, and secure connections for IoT devices and users.

## Description

Energy ON is a backend for an IoT platform, providing REST and WebSocket APIs for device connectivity, telemetry ingestion, and user management. Built with [NestJS](https://nestjs.com/) and Node.js v24.2.0, it supports secure authentication and multi-company device management.

## Features

- Device registration and management
- Company-based multi-tenancy
- User authentication (JWT)
- Telemetry ingestion via WebSocket
- RESTful API for CRUD operations

## Tech Stack

- Node.js v24.2.0
- NestJS Framework
- TypeORM
- **PostgreSQL with TimescaleDB** (for time-series data storage)

## Project setup

```bash
# Install dependencies
$ pnpm install
```

## Running the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## API Usage Example

### Authentication

```http
POST /auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "yourpassword"
}
```

### Get Devices (for a company)

```http
GET /devices?companyId=12345
Authorization: Bearer <your_jwt_token>
```

### WebSocket Telemetry

Connect to: `ws://<host>/telemetry`

Send telemetry data:
```json
{
  "deviceId": "abc123",
  "temperature": 22.5,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Environment

- Node.js v24.2.0
- **PostgreSQL with TimescaleDB** (make sure TimescaleDB extension is enabled)
- Configure your database connection in `src/app.module.ts` or via environment variables.

## Testing

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Author

Sebastian Solis