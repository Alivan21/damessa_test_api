# damessa_test_api

API sederhana menggunakan Node.js, TypeScript, Express, Sequelize (MySQL), dan Umzug untuk migrasi dan seeder.

## Prasyarat

- Node.js 20+ (disarankan 22)
- PNPM (disarankan) atau NPM
- MySQL 8+

## Cara Instalasi & Menjalankan Aplikasi

1. Clone repo ini, lalu masuk ke folder proyek.
2. Install dependency:
   - Dengan PNPM: `pnpm install`
   - Atau NPM: `npm install`
3. Siapkan file `.env` (lihat contoh di bawah) dan pastikan database MySQL sudah dibuat.
4. Jalankan migrasi dan seeder (opsional namun direkomendasikan untuk data awal):
   - `pnpm migrate:up`
   - `pnpm seed:up`
   - Atau dapat menggunakan: `pnpm db:fresh` (drop semua seed/migrasi lalu ulang dari awal)
5. Mode pengembangan (hot-reload): `pnpm dev`
6. Build produksi: `pnpm build`
7. Menjalankan build produksi: `pnpm start`

Aplikasi secara default berjalan pada `http://localhost:3000/api`.

## Variabel Lingkungan (.env)

Contoh konfigurasi `.env`:

```env
# Koneksi Database MySQL
DB_HOST=localhost
DB_PORT=3306           # Port default MySQL adalah 3306
DB_NAME=damessa_db
DB_USER=root
DB_PASS=your_password

# Server
PORT=3000

# Keamanan
JWT_SECRET=supersecret
```

Catatan:

- Pastikan database `DB_NAME` sudah dibuat di MySQL sebelum menjalankan migrasi.
- Nilai default di kode: jika tidak diisi, `PORT` dan `JWT_SECRET` memiliki default, namun sangat disarankan mengatur secara eksplisit.

## Perintah Terkait Database

- Jalankan semua migrasi: `pnpm migrate:up`
- Batalkan semua migrasi: `pnpm migrate:down`
- Lihat status migrasi: `pnpm migrate:status`
- Lihat migrasi pending: `pnpm migrate:pending`
- Jalankan semua seeder: `pnpm seed:up`
- Batalkan semua seeder: `pnpm seed:down`
- Lihat status seeder: `pnpm seed:status`
- Lihat seeder pending: `pnpm seed:pending`
- Reset database (drop seeder, drop migrasi, migrasi ulang, seed ulang): `pnpm db:fresh`

## Struktur Folder

```
.
├─ docs/
├─ src/
│  ├─ app.ts                     # Inisialisasi Express, middleware dasar, mount routes, cek koneksi DB
│  ├─ index.ts                   # Entry point server (listen pada PORT)
│  ├─ config/
│  │  ├─ env.ts                 # Pembacaan variabel lingkungan (.env)
│  │  └─ database.ts            # Inisialisasi Sequelize (MySQL)
│  ├─ controllers/              # Controller untuk menangani request/response
│  ├─ helpers/                  # Helper utilitas (bcrypt, jwt, pagination, response, dll.)
│  ├─ middlewares/              # Middleware (auth, validation)
│  ├─ migrations/               # File migrasi database (Umzug)
│  ├─ models/                   # Definisi model Sequelize (User, Category, Product)
│  ├─ routes/                   # Definisi route Express (prefix dengan /api)
│  ├─ seeders/                  # Seeder data (Umzug) + data JSON
│  ├─ services/                 # Business logic (auth, category, product, pagination)
│  ├─ validators/               # Validasi request menggunakan Zod
│  ├─ migrate.ts                # Runner CLI untuk migrasi (Umzug)
│  └─ seed.ts                   # Runner CLI untuk seeder (Umzug)
├─ eslint.config.js             # Konfigurasi ESLint
├─ tsconfig.json                # Konfigurasi TypeScript
├─ pnpm-workspace.yaml          # Konfigurasi workspace PNPM
├─ pnpm-lock.yaml               # Lockfile PNPM
└─ package.json                 # Skrip dan dependency
```

## Tools/Library yang Digunakan

- Runtime & Bahasa
  - Node.js, TypeScript
- Framework & Core
  - Express (HTTP server & routing)
- Database & ORM
  - Sequelize (ORM untuk MySQL)
  - mysql2 (driver MySQL)
  - Umzug (migrasi & seeder)
- Keamanan & Utilitas
  - dotenv (env vars)
  - bcrypt (hashing password)
  - jsonwebtoken (JWT)
  - zod (validasi schema request)
- Pengembangan
  - tsx (dev runner TypeScript)
  - eslint, eslint-plugin-perfectionist, typescript-eslint
  - prettier
  - @tsconfig/node22

## Skrip Penting (package.json)

- Pengembangan: `pnpm dev`
- Build: `pnpm build`
- Start produksi: `pnpm start`
- Lint: `pnpm lint` | Perbaiki otomatis: `pnpm lint:fix`
- Format: `pnpm format` | Cek format: `pnpm format:check`
- Migrasi DB: `pnpm migrate:up` | `pnpm migrate:down` | `pnpm migrate:status` | `pnpm migrate:pending`
- Seeder DB: `pnpm seed:up` | `pnpm seed:down` | `pnpm seed:status` | `pnpm seed:pending`
- Reset DB cepat: `pnpm db:fresh`
