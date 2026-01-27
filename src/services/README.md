# Services Layer

The **`src/services`** directory implements the application’s business‑logic services that interact with the database and other external resources.

- **Data services** (e.g., `data/member.ts`, `data/admin.ts`, `data/sysadmin.ts`) contain functions for fetching, creating, updating, and deleting records. They use the Kysely DB client and return plain JavaScript/TypeScript objects.
- Services are **re‑usable** across API routes, server actions, and server components, keeping data‑access code in one place.
- Each service should handle input validation, error mapping (using the error classes from `src/lib/errors.ts`), and any necessary authorization checks before touching the DB.

Interns can add new service modules here when new domain entities are introduced, and they should keep the functions small and focused (single responsibility).
