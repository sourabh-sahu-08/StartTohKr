# StartTohKr

**Tagline:** "Where Ideas Meet Opportunities."

## Overview
StartTohKr is an AI‑powered innovation ecosystem built for the **Smart India Hackathon (SIH)**. It connects **Startups, Government Departments, Investors, Mentors, Industry Partners, and Evaluators** to manage the full lifecycle of innovation – from idea discovery to scaling.

The project has been refactored to **physically separate the frontend and backend code** while preserving all existing functionality. Backend logic lives under `src/backend/` (repositories → services → actions) and the frontend accesses it only through typed API wrappers in `src/lib/api/`.

---

## Tech Stack
- **Framework:** Next.js 16 (App Router) – server actions are now thin controllers that call the backend services.
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui, Radix UI, Base UI
- **Icons & Animation:** Lucide React, Framer Motion
- **Database & ORM:** PostgreSQL + Prisma
- **Authentication:** NextAuth.js (role‑based)
- **State Management:** Zustand
- **CI / Deploy:** Vercel (automatic `npm run build`)

---

## Repository Structure
```
StartTohKr/
├─ .agents/                     # Agent configuration files
├─ .next/                       # Build artifacts (generated)
├─ node_modules/                # Dependencies
├─ prisma/                      # Prisma schema & seed script
│   └─ schema.prisma
├─ public/                      # Static assets
├─ src/
│   ├─ app/                     # Next.js App Router – page components & API routes
│   ├─ backend/                 # **Separated backend**
│   │   ├─ repositories/        # Direct DB access (Prisma)
│   │   ├─ services/            # Business logic
│   │   └─ actions/             # Controllers (server actions)
│   ├─ components/              # UI components (global)
│   ├─ lib/                     # API wrappers (`src/lib/api/*.api.ts`) and utilities
│   ├─ store/                   # Zustand stores (client state)
│   └─ ...
├─ .env.example                 # Template for environment variables
├─ .env                         # Your local environment configuration (git‑ignored)
├─ next.config.ts
├─ package.json
├─ prisma.config.ts
├─ tsconfig.json
└─ README.md
``` 

---

## Prerequisites
- **Node.js** (v20 or later) and **npm**
- **PostgreSQL** database (local or hosted – Neon, Supabase, Render, …)
- **Git** for version control
- **Vercel account** (optional, for production deployment)

---

## Setting Up the `.env` File
Rename the template and fill in the required keys:
```bash
cp .env.example .env   # on Windows: copy .env.example .env
```
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string. Use `postgresql://USER:PASSWORD@HOST:PORT/DATABASE` for local dev or the URI provided by your hosted provider. | `postgresql://postgres:myPass@localhost:5432/starttohkr` |
| `AUTH_SECRET` **or** `NEXTAUTH_SECRET` | Random 32‑byte secret used by NextAuth to encrypt session cookies. Generate with `openssl rand -base64 32` or any secure random generator. | `A+Secure+Random+StringGeneratedHere=` |
| `NEXTAUTH_URL` | Base URL of the app (used for redirects). Use `http://localhost:3000` while developing. | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Public URL accessible from the client side – mirrors `NEXTAUTH_URL`. | `http://localhost:3000` |
| `AI_API_KEY` | (Optional) API key for any AI service you integrate (OpenAI, Anthropic, etc.). Leave empty if not used. | `sk-xxxxxx` |

> **Important:** Do **not** commit `.env` to the repository. It is already listed in `.gitignore`.

---

## Running the Project Locally
```bash
# 1. Clone the repo
git clone https://github.com/sourabh-sahu-08/StartTohKr.git
cd StartTohKr

# 2. Install dependencies
npm install

# 3. Configure the environment (see above)
#    Ensure `DATABASE_URL` points to a running Postgres instance.
#    If you don't have a DB yet, you can start a local container:
#    docker run --name starttohkr-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16

# 4. Push the Prisma schema to the DB and seed demo data
npx prisma db push   # creates tables
npx prisma db seed   # optional – creates demo users, startups, etc.

# 5. Start the dev server
npm run dev
```
Open <http://localhost:3000> in your browser. The app should load without TypeScript errors (`npm run build` also succeeds).

---

## Building & Testing
```bash
# Type‑check and compile the production build
npm run build
```
The command should finish with `Compiled successfully` and list all routes.

---

## Deployment (Vercel)
1. **Create a production PostgreSQL DB** (Neon, Supabase, Render, etc.) and copy its connection URI.
2. **Merge your changes** to the `main` branch (or configure Vercel to deploy the `sourabh‑changes` branch directly).
   ```bash
   git checkout main
   git pull origin main
   git merge sourabh-changes
   git push origin main
   ```
3. **Create a Vercel project** and import the GitHub repository.
4. In **Environment Variables** add:
   - `DATABASE_URL` – the production DB URI
   - `NEXTAUTH_SECRET` – a random 32‑byte string
   - `NEXTAUTH_URL` – `https://<your‑project>.vercel.app`
   - `NEXT_PUBLIC_APP_URL` – same as above
   - (optional) `AI_API_KEY`
5. Deploy – Vercel will run `npm run build` automatically.
6. **Push the schema & seed data** to the production DB (once) from your machine:
   ```bash
   # Temporarily point .env to the production DB URL
   DATABASE_URL="postgresql://..." npx prisma db push --accept-data-loss
   npx prisma db seed
   ```
   Afterwards, revert `.env` back to your local DB URL.

Your live app is now accessible at the Vercel URL.

---

## Contributing
- Branch from `main` or work on feature branches.
- Run `npm run lint` and `npm run build` before opening a PR.
- Follow the existing code‑base conventions – any new server‑side logic should go under `src/backend/` and expose an API wrapper in `src/lib/api/`.

---

## License
MIT © 2026 Sourabh Sahu
