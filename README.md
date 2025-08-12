# damessa_test_api

Simple API pakai Node.js + TypeScript + Express + Sequelize (MySQL) + Umzug (migration & seeder).

## Yang dibutuhin (Prerequisites)

- Node.js 20+ (recommended 22)
- PNPM (recommended) atau NPM
- MySQL 8+

## Cara install & run

1. Clone repo ini dan masuk ke folder project.
2. Install dependencies:
   - PNPM: `pnpm install`
   - NPM: `npm install`
3. Siapkan `.env` (contoh di bawah) dan pastikan database MySQL sudah dibuat.
4. Run migration & seeder:
   - `pnpm migrate:up`
   - `pnpm seed:up`
   - Atau pakai: `pnpm db:fresh` (drop semua seed/migrasi lalu setup ulang dari awal)
5. Dev mode (hot-reload): `pnpm dev`
6. Build production: `pnpm build`
7. Start production build: `pnpm start`

Default base URL: `http://localhost:3000/api`.

## Environment (.env)

Sample `.env`:

```env
# MySQL Connection
DB_HOST=localhost
DB_PORT=3306           # default MySQL port
DB_NAME=damessa_db
DB_USER=root
DB_PASS=your_password

# Server
PORT=3000

# Security
JWT_SECRET=supersecret
```

Notes:

- Pastikan database `DB_NAME` sudah ada di MySQL sebelum jalanin migration.
- Sebaiknya set `PORT` dan `JWT_SECRET` sendiri (jangan pakai default untuk production).

## Database commands

- Migrate all: `pnpm migrate:up`
- Rollback all: `pnpm migrate:down`
- Migration status: `pnpm migrate:status`
- Pending migrations: `pnpm migrate:pending`
- Seed all: `pnpm seed:up`
- Unseed all: `pnpm seed:down`
- Seeder status: `pnpm seed:status`
- Pending seeders: `pnpm seed:pending`
- Fresh reset (drop seeder & migration, setup ulang): `pnpm db:fresh`

## API docs (Postman)

- Koleksi Postman ada di folder `docs/`: `Damessa Test API.postman_collection.json`.
- Import ke Postman, sesuaikan `base_url` kalau perlu (default `http://localhost:3000/api`).
- Login dulu biar variabel `{{token}}` otomatis keisi sebelum akses endpoint yang butuh Bearer token.

## Folder structure

```
.
├─ docs/
├─ src/
│  ├─ app.ts                     # Init Express, basic middleware, mount routes, DB connection check
│  ├─ index.ts                   # Server entry (listen on PORT)
│  ├─ config/
│  │  ├─ env.ts                 # Read environment vars (.env)
│  │  └─ database.ts            # Init Sequelize (MySQL)
│  ├─ controllers/              # Request/response handler
│  ├─ helpers/                  # Utilities (bcrypt, jwt, pagination, response, etc.)
│  ├─ middlewares/              # Auth & validation middleware
│  ├─ migrations/               # Database migrations (Umzug)
│  ├─ models/                   # Sequelize models (User, Category, Product)
│  ├─ routes/                   # Express routes (prefix /api)
│  ├─ seeders/                  # Seed data (Umzug) + JSON data
│  ├─ services/                 # Business logic (auth, category, product, pagination)
│  ├─ validators/               # Request validation (Zod)
│  ├─ migrate.ts                # Migration runner (Umzug)
│  └─ seed.ts                   # Seeder runner (Umzug)
├─ eslint.config.js             # Konfigurasi ESLint
├─ tsconfig.json                # Konfigurasi TypeScript
├─ pnpm-workspace.yaml          # Konfigurasi workspace PNPM
├─ pnpm-lock.yaml               # Lockfile PNPM
└─ package.json                 # Skrip dan dependency
```

## Tools & Libraries

- Runtime & language: Node.js, TypeScript
- Framework & core: Express (HTTP server & routing)
- Database & ORM: Sequelize (MySQL), mysql2 (driver), Umzug (migrations & seeders)
- Security & utils: dotenv, bcrypt, jsonwebtoken (JWT), zod (request schema validation)
- Dev tools: tsx, eslint (+perfectionist, typescript-eslint), prettier, @tsconfig/node22

## Useful scripts (package.json)

- Dev: `pnpm dev`
- Build: `pnpm build`
- Start (production): `pnpm start`
- Lint: `pnpm lint` | Fix: `pnpm lint:fix`
- Format: `pnpm format` | Check: `pnpm format:check`
- Migrations: `pnpm migrate:up` | `pnpm migrate:down` | `pnpm migrate:status` | `pnpm migrate:pending`
- Seeders: `pnpm seed:up` | `pnpm seed:down` | `pnpm seed:status` | `pnpm seed:pending`
- Fresh reset: `pnpm db:fresh`
