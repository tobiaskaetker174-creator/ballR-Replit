# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a BallR Expo React Native app (mobile), an Express API server, and a mockup sandbox for component previews.

## BallR Mobile App (`artifacts/mobile`)

Football/soccer pickup game discovery app for expats in Bangkok/Bali. Uses "Iron & Moss" design system (dark charcoal `#141312` + moss green `#2D5A27`/`#A1D494`), Inter font family.

### Screens

| Screen | Path | Description |
|--------|------|-------------|
| Discover | `(tabs)/index.tsx` | Game listings with featured pitch, filters (city/skill/date/ELO), FAB for create game, bell badge |
| My Games | `(tabs)/my-games.tsx` | Auth-gated: shows login prompt if not logged in; upcoming + completed games + rating prompts |
| Rankings | `(tabs)/leaderboard.tsx` | Baller of the Month podium + ELO leaderboard with formula panel |
| Profile | `(tabs)/profile.tsx` | Full user profile: ELO tier, baller score, ELO history chart, calibration bar, social links, reviews, analytics button |
| Game Detail | `game/[id].tsx` | Game info, clickable team/player rows → player profile, AI teams modal, carpool modal, payment modal, chat button |
| Create Game | `create-game.tsx` | Full organizer form (venue, date, time, duration, price, skill, player limit, cutoff, description) |
| Chat | `chat/[id].tsx` | Real-time simulated chat per game with system messages |
| Rate Teammates | `rate/[id].tsx` | Star ratings (skill + sportsmanship) per teammate; player names tappable → profile |
| Organizer Panel | `organizer/[id].tsx` | Mark complete, select winner (blue/red/draw), mark no-shows |
| Notifications | `notifications.tsx` | Notification center with unread badge count, mark-all-read |
| Auth | `auth.tsx` | Login/signup modal with email/password; guest browsing supported |
| Player Profile | `player/[id].tsx` | Public profile with stats, social links, ELO, review submission form, report button |
| Analytics | `analytics.tsx` | Rivals system, best teammates, BOTM breakdown |
| Report Player | `report/[id].tsx` | Anonymous reporting (disrespect/rule_violation/language/no_show/other) |
| Reviews | `reviews.tsx` | Pending/published review moderation tabs |
| Admin Panel | `admin.tsx` | Venue field image management, player reports dashboard, user management |

### Mock Data (`constants/mock.ts`)
- `PLAYERS` (11 players), `GAMES` (upcoming), `COMPLETED_GAMES`, `ALL_GAMES`
- `CHAT_MESSAGES`, `NOTIFICATIONS` (2 unread), `ELO_HISTORY`, `PENDING_RATINGS`
- `PROFILE_REVIEWS`, `MY_GAMES_IDS = Set(["g1","g3"])`, `VENUES_LIST`
- Current user: PLAYERS[0] (Maya, ELO 820, eloCalibrated: true)

### Auth Context (`context/AuthContext.tsx`)
- Starts logged-out; login resolves to PLAYERS[0]; signup creates new player
- `useAuth()` → `{ user, isLoggedIn, login, signup, logout, updateProfile }`

### Design System
- Colors: base `#141312`, surface `#201F1E`, overlay `#363433`, primary `#2D5A27`, accent `#A1D494`, muted `#8C8782`
- Additional: red `#E05252`, blue `#5B8FE8`, amber `#E8A93A`, purple `#9B6FD4`, teal `#4ABFB0`
- Font: Inter_400Regular / 500Medium / 600SemiBold / 700Bold



## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
