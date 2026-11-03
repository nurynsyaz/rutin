# Rutin

A daily routine scheduler — plan the day once, repeat what works.

Frontend only, for now. Everything runs in the browser against mock data stored in
IndexedDB. No backend exists yet, and nothing leaves the device.

---

## Quick start

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

### Demo accounts

| Email                | Password    | Role                                |
| -------------------- | ----------- | ----------------------------------- |
| `member@rutin.test`  | `Rutin#2026` | Member                              |
| `admin@rutin.test`   | `Rutin#2026` | Admin                               |
| `expired@rutin.test` | `Rutin#2026` | Member — session expires after 60 s |

> Sign-in is not implemented yet. These accounts come from `app/mocks/seed/users.json`
> and are wired up in the Identity milestone.

---

## Scripts

| Command                 | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `pnpm dev`              | Dev server with hot reload on port 3000                            |
| `pnpm generate`         | **Production build** — static files in `.output/public`            |
| `pnpm preview`          | Serve the generated build locally                                  |
| `pnpm build`            | Nitro server build — not used here, prefer `generate`              |
| `npx vue-tsc --noEmit`  | Type check                                                         |
| `npx eslint .`          | Lint, including architecture boundary rules                        |
| `npx vitest`            | Unit tests                                                         |

The service worker is **disabled in dev**. PWA install, offline behaviour and the
"new version available" prompt only work after `pnpm generate && pnpm preview`.

---

## Stack

| Concern    | Choice                                                          |
| ---------- | --------------------------------------------------------------- |
| Framework  | Nuxt 4.6, client-only (`ssr: false`), static output             |
| Language   | TypeScript, strict                                              |
| State      | Pinia 3 (setup stores) + `pinia-plugin-persistedstate`          |
| Events     | `mitt` behind a typed `EventBus` port                           |
| Mock data  | In-app repositories + IndexedDB via `idb-keyval`                |
| Validation | `zod`                                                           |
| Styling    | Tailwind CSS 4 — CSS-first, no `tailwind.config.js`             |
| Fonts      | Plus Jakarta Sans, JetBrains Mono                               |
| Icons      | `@nuxt/icon` (Lucide)                                           |
| Dates      | `date-fns` + `@date-fns/tz`                                     |
| i18n       | `@nuxtjs/i18n` 10 — English + Bahasa Melayu                    |
| PWA        | `@vite-pwa/nuxt` (Workbox), update prompt, never silent reload   |
| Tests      | Vitest, `@nuxt/test-utils`, Playwright                          |
| Lint       | `@nuxt/eslint`, `eslint-plugin-boundaries`                      |

---

## Architecture

A **modular monolith**: one build, one router, but five strictly separated modules.

Each module is a **bounded context** that owns its own model, store, repository and
UI. Contexts never import each other — they communicate only by publishing and
subscribing to domain events.

```text
  page
   │
   ▼
  ui/                     Vue components. Calls store commands, reads getters.
   │
   ▼
  application/            Pinia store: state + commands + event handlers.
   │                      Validates, calls a repository port, updates state, publishes.
   ▼
  domain/                 Pure TypeScript: entities, invariants, zod schemas.
   │                      No Vue. No Nuxt. No Pinia. No fetch.
   ▼
  infrastructure/         Implements the ports.
                          Mock*Repository today, Http*Repository later.
```

Dependencies point **downward only**. That is what makes `domain/` testable without
a DOM or a database, and what makes swapping the backend a configuration change.

### Layers

| Layer             | Contains                                    | May import                      |
| ----------------- | ------------------------------------------- | ------------------------------- |
| `domain/`         | Entities, value objects, invariants, schemas | Nothing — plain TypeScript      |
| `application/`    | Pinia setup store, commands, event handlers  | own `domain/`, own ports        |
| `infrastructure/` | `Mock*Repository`, later `Http*Repository`   | own `domain/`                   |
| `ui/`             | Vue components                              | own `application/`, own `domain/` |

Enforced by `eslint-plugin-boundaries`. A violation fails lint.

### Contexts

| Context          | Owns                                              |
| ---------------- | ------------------------------------------------- |
| Identity & Access | Session, current user, role, permissions         |
| Profile          | Display name, avatar, timezone, day start, stats  |
| Scheduling       | Routines, recurrence, occurrences, completion     |
| Attachments      | File metadata, blobs, upload jobs                 |
| Shell            | Layout, navigation, toasts, connectivity, PWA     |

### Events

Names follow `<context>.<PastTenseVerb>`. Every payload carries `v: 1` and
`occurredAt` (ISO 8601). The full catalogue lives in
`app/kernel/events/catalogue.ts`.

```text
  scheduling.RoutineCreated
        ├──► Shell          shows a toast
        └──► Attachments    syncs file references
```

Cross-context subscriptions live in exactly one place —
`app/plugins/03.event-handlers.ts` — so the wiring can be read top to bottom.

---

## Project structure

```text
app/
  pages/                  thin route files; compose context UI only
  layouts/                auth.vue (centered card) · app.vue (sidebar / bottom nav)
  middleware/             auth.global.ts (signed in?) · can.ts (permission meta)
  plugins/                01.event-bus · 02.repositories · 03.event-handlers
  contexts/
    identity/             { domain/ application/ infrastructure/ ui/ }
    profile/              { domain/ application/ infrastructure/ ui/ }
    scheduling/           { domain/ application/ infrastructure/ ui/ }
    attachments/          { domain/ application/ infrastructure/ ui/ }
    shell/                { application/ ui/ }
  kernel/                 ids, Result, Clock, EventBus port + mitt adapter
  mocks/
    seed/                 users.json · routines.json · files.json
    db.ts                 IndexedDB wrapper, latency + failure injection
i18n/
  locales/                en.json · ms.json
public/
  icons/                  PWA icons — 192, 512, maskable 512
```

`kernel/` is shared infrastructure, importable by every context. It must not
contain business rules.

---

## Mock data

Every read and write goes through a repository port. The mock adapters load seed
JSON on first run, then persist to IndexedDB, so the demo behaves like a real app
across reloads.

- Simulated latency: 150–600 ms, configurable in `app/mocks/db.ts`
- Failure injection: `?mockFail=signin,upload,complete` in the URL
- Reset: dev panel → "Reset demo data"

### Switching to a real API

The implementation is chosen in `app/plugins/02.repositories.ts` from
`runtimeConfig.public.dataSource`.

```bash
# .env
NUXT_PUBLIC_DATA_SOURCE=http
```

Then provide `Http*Repository` classes satisfying the same ports. Nothing in
`ui/` or `application/` changes.

Repositories return `Result<T, DomainError>` with the codes
`UNAUTHENTICATED · FORBIDDEN · VALIDATION · CONFLICT · NETWORK`, so the same
error handling works when a real API returns 401 and 403.

---

## Language

English (default) and Bahasa Melayu, switchable at any time without a reload.
Detection order: profile setting → device choice → browser language → English.

Message files live in `i18n/locales/`. Both must contain **identical keys** —
CI fails otherwise. Dates, times and numbers are formatted with `Intl` in the
active locale and the profile's timezone, always 24-hour.

Routine titles, notes and file names are user content and are never translated.

---

## Design tokens

Defined in `app/assets/css/main.css` under `@theme`:

- Brand `#0F766E`, surface `#F6F7F9`
- Sans: Plus Jakarta Sans · Mono: JetBrains Mono
- Tokens generate utilities automatically — `--color-brand-700` gives `bg-brand-700`,
  `text-brand-700`, `border-brand-700`, and so on

Tailwind 4 is CSS-first. There is no `tailwind.config.js` and no `@tailwind`
directives — only `@import "tailwindcss";`.

---

## Status

Foundation is in place. Screens are not built yet.

- [x] Nuxt 4 scaffold, static SPA output
- [x] Tailwind tokens and fonts
- [x] Kernel: ids, Result, Clock, typed event bus
- [x] English / Malay i18n
- [x] PWA manifest and update prompt
- [ ] Boundary lint rules
- [ ] Event bus and repository plugins
- [ ] Mock database and seed data
- [ ] Screens S-01 to S-13
