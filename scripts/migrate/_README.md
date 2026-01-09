For migrations scripts, make them executable:

```bash
chmod +x scripts/migrations/*
```

Then run them by:

```bash
./scripts/migrations/create.sh <migration_name>
./scripts/migrations/migrate.sh
```

or through npm

```bash
npm run migrate:create
npm run migrate:up d
```