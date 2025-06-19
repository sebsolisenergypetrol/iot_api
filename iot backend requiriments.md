# Project Requirements Document (PRD): IoT Backend API (NestJS)

## Overview

This document defines the functional and technical requirements for the Backend API built with **NestJS**, responsible for:

1. Authenticating and authorizing users.
2. Managing role-based access.
3. Handling real-time telemetry from IoT devices.
4. Exposing real-time data to connected front-end clients via WebSockets.

---

## System Context

### Data Flow

* **Node‑RED**: Continues to handle sensor logic and publish telemetry to MQTT broker or directly to HTTP API.
* **NestJS API**: this app

  * Subscribes to MQTT topics or receives HTTP POST data.
  * Validates, tags, and stores telemetry.
  * Broadcasts real-time updates to clients using WebSockets.

* **Front-End Clients**:

  * Connect to WebSocket endpoint.
  * Receive live updates for selected devices.
  * Pull historical data via REST API.

---

## Functional Requirements

### 1. Authentication & Authorization

* **Endpoints**

  * `POST /auth/login`: Login with email and password.
  * `GET /auth/profile`: Get current user session.
* **Features**

  * JWT-based authentication using `@nestjs/jwt`.
  * Password hashing using bcrypt.
  * Secure cookie support for web (HttpOnly, Secure).
  * Bearer token support for mobile clients.
  * Role-based access control using `@Roles()` decorator and `RolesGuard`.

#### 1. Authentication

* Email/password login endpoint (`POST /auth/login`)
* JWT token generation
* Bcrypt password hashing
* Cookie-based auth for web, Bearer token for mobile
* JWT includes user ID, role, and company ID

#### 2. Role-Based Access Control

* `@Roles()` decorator with `RolesGuard`
* Admin (web) and user (mobile) roles
* Admins can manage devices (future feature)
* Access is scoped to user’s company via `CompanyGuard`

#### 3. Multi-Tenant Support

* Each user belongs to a `Company`
* All device and user data is isolated per company
* API routes filter data using `company_id` from JWT payload

#### 4. Devices API

* `GET /devices`: list devices within user's company
* `GET /devices/:id`: get device details (company-validated)
* WebSocket gateway to push real-time data scoped per company

#### 5. Users API

* `GET /me`: fetch current user profile
* Future: user invitations and role management within a company

### Technologies

* NestJS
* PostgreSQL / TimescaleDB
* bcrypt, Passport.js, JWT
* socket.io (WebSocket gateway)

### Database Schema (Simplified)

```
companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
)

users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  company_id UUID REFERENCES companies(id)
)

devices (
  id UUID PRIMARY KEY,
  name TEXT,
  company_id UUID REFERENCES companies(id)
)

readings (
  id UUID PRIMARY KEY,
  device_id UUID REFERENCES devices(id),
  value JSONB,
  timestamp TIMESTAMPTZ
)

### 2. Device Data API

* **Endpoints**

  * `GET /devices`: List all devices accessible to the user.
  * `GET /devices/:id`: Return device metadata and latest reading.
* **Permissions**

  * Admins (web users) can access all devices.
  * Regular users (mobile) can view only authorized devices.

### 3. Real-Time Telemetry

* **MQTT Subscription**

  * Subscribes to relevant MQTT topics.
  * Parses and validates incoming messages.
  * Tags with device metadata, timestamp.
  * Optionally persists data to PostgreSQL/TimescaleDB.

* **WebSocket Broadcast**

  * WebSocket gateway implemented with `@nestjs/websockets`.
  * Supports **Socket.IO** (default) or **fast WS** using uWebSockets.
  * Clients authenticate on connection (token handshake).
  * Devices emit real-time updates to relevant connected users.
  * Events include:

    * `device:update` – new telemetry data
    * `device:status` – online/offline state

---

## Technical Requirements

### Stack

* **Language**: TypeScript
* **Framework**: NestJS
* **Protocols**: HTTP (REST), WebSocket (Socket.IO), MQTT
* **Security**: JWT, bcrypt, HTTPS, CORS, role guards
* **Storage**: PostgreSQL (with TimescaleDB extension for telemetry)

### MQTT Handling

* Use `mqtt` or `mqtts` client in NestJS service.
* Central subscription service to receive all device messages.
* Normalize and emit to WebSocket clients.

### WebSocket Gateway

* `@WebSocketGateway()` for live telemetry updates.
* Use guards to verify token and role on `handleConnection()`.
* Emit to specific users based on device subscriptions.
* Auto-disconnect on token expiry or idle timeout.

---

## Non-Functional Requirements

* **Scalability**: Support up to 50+ devices and 5 locations.
* **Security**:

  * HTTPS enforced
  * Tokens rotated on login
  * Input validation using `class-validator`
* **Performance**:

  * Support 1-second telemetry intervals per device
  * WebSocket events under 200ms latency
* **Monitoring**:

  * Log all auth and telemetry events
  * Include audit logging for data emissions

---

## Folder Structure (Backend)

```
/backend/api/
├── src/
│   ├── auth/           # AuthService, LoginController, JWT strategies
│   ├── users/          # UsersService, user roles, profile endpoint
│   ├── companies/
│   ├── devices/        # DevicesService, DevicesController
│   ├── telemetry/      # MQTT Client, WebSocket Gateway
│   ├── common/         # DTOs, Guards, Utils
│   ├── main.ts
│   └── app.module.ts
└── .env