# Zira

Zira is a private internal work OS built on Next.js 16. This repository now includes the first production-oriented scaffold for the app shell, environment validation, service helpers, local infrastructure, and unit testing.

## Included Foundation

- App Router shell with a Zira landing page and a health endpoint
- Typed environment normalization with development defaults and production guards
- MongoDB, Redis, S3, and SMTP helper modules
- Docker Compose services for MongoDB and Redis
- Vitest-based unit test setup

## Local Setup

1. Copy `.env.example` to `.env.local` and fill in real values.
2. Start local infrastructure if needed:

```bash
docker compose up -d
```

3. Start the app:

```bash
npm run dev
```

Open http://localhost:3000.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Core Paths

- `app/` App Router pages and route handlers
- `lib/config/` env parsing and normalization
- `lib/db/` MongoDB connection helper
- `lib/realtime/` Redis and queue clients
- `lib/s3/` S3 presign helpers
- `lib/email/` Nodemailer integration
- `lib/shared/` shared errors and contracts
- `tests/` unit test coverage

## Notes

- `.env.local` must stay uncommitted.
- Production boots fail fast on missing required secrets.
- The current codebase is the platform foundation, not the full Zira product surface yet.
