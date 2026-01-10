# PMF App Template

A full-stack [Next.js](https://nextjs.org) application template with authentication, database migrations, and automated Dokku deployment.

## Quick Start

### 1. Initialize the Project

After cloning this repository, run the initialization script to set up your development and production environments:

```bash
pnpm run init
```

This will:
- Set up SSH access to the Dokku host
- Create Dokku applications (dev & prod)
- Set up Postgres databases
- Run database migrations
- Create your admin user account
- Seed test data

**Note:** You'll need the PMF Dokku host address from your PMF Builder admin.

For detailed information about the initialization process, see [scripts/init/README.md](scripts/init/README.md).

### 2. Start Development

Once initialization is complete, start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
.
├── scripts/
│   ├── init/          # Project initialization scripts
│   ├── migrate/       # Database migration scripts
│   └── destroy/       # Cleanup scripts
├── src/
│   ├── app/           # Next.js app directory
│   ├── lib/
│   │   ├── auth/      # Authentication utilities
│   │   └── db/        # Database client and migrations
│   └── ...
└── ...
```

## Scripts Documentation

This template includes automated scripts for managing your application lifecycle:

- **[scripts/init/README.md](scripts/init/README.md)** - Complete project initialization guide
- **[scripts/migrate/README.md](scripts/migrate/README.md)** - Database migration management
- **[scripts/destroy/README.md](scripts/destroy/README.md)** - Application cleanup and removal

## Common Tasks

### Database Migrations

Create a new migration:
```bash
pnpm migrate:create <migration_name>
```

Run migrations (development):
```bash
pnpm migrate:up d
```

See [scripts/migrate/README.md](scripts/migrate/README.md) for detailed migration workflows.

### Development Workflow

1. Make your changes
2. Create database migrations if needed
3. Test locally with `pnpm dev`
4. Commit your changes
5. Deploy to Dokku (handled automatically via git push)

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org) 15 with App Router
- **Language:** TypeScript
- **Database:** PostgreSQL with [Kysely](https://kysely.dev) query builder
- **Authentication:** Custom auth with secure password hashing
- **Migrations:** [golang-migrate](https://github.com/golang-migrate/migrate)
- **Deployment:** [Dokku](https://dokku.com) (PaaS)
- **Package Manager:** pnpm

## Environment Variables

After initialization, your `.env` file will contain:

- `PMF_DOKKU_HOST` - Your Dokku host address
- `DATABASE_URL` - Active database connection URL
- `DEV_URL` - Development database URL
- `PROD_URL` - Production database URL
- `PASSWORD_HASH_SECRET` - Pepper for password hashing

**Never commit the `.env` file to version control.**

## Deployment

### Development Environment

```bash
git push dokku-dev main:master
```

### Production Environment

```bash
git push dokku main:master
```

Database migrations run automatically during deployment via the predeploy hook defined in `app.json`.

## Need Help?

- **Initialization issues?** See [scripts/init/README.md](scripts/init/README.md)
- **Migration problems?** See [scripts/migrate/README.md](scripts/migrate/README.md)
- **Want to start over?** See [scripts/destroy/README.md](scripts/destroy/README.md)
- **Next.js questions?** Check the [Next.js Documentation](https://nextjs.org/docs)

## Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub](https://github.com/vercel/next.js)

### Other Resources

- [Kysely Documentation](https://kysely.dev) - Type-safe SQL query builder
- [Dokku Documentation](https://dokku.com/docs) - Self-hosted PaaS
- [golang-migrate](https://github.com/golang-migrate/migrate) - Database migrations
