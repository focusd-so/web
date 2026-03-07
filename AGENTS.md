# AGENTS.md

## Cursor Cloud specific instructions

This is a **React/TypeScript SPA** (Focusd Work marketing site + web app frontend). No backend services are needed in this repo — the backend API lives in a separate repository.

### Quick reference

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` (port 3000) |
| Build | `pnpm build` |
| Tests | `pnpm test` (Vitest) |
| Type check | `pnpm exec tsc --noEmit` |

### Notes

- **No test files exist yet.** `pnpm test` exits with code 1 ("No test files found") — this is expected, not a bug.
- **No ESLint config** is present; there is no lint script in `package.json`.
- The project uses **pnpm** (lockfile: `pnpm-lock.yaml`). Node 22 is required.
- After `pnpm install`, pnpm may warn about ignored build scripts for `esbuild`, `@tailwindcss/oxide`, and `@parcel/watcher`. These native addons are needed — if the dev server or build fails, run `pnpm rebuild esbuild @tailwindcss/oxide @parcel/watcher`.
- Two route files (`login/desktop.tsx`, `login/web.tsx`) are fully commented out. TanStack Router warns about them during build/dev — this is intentional and harmless.
- Dark mode is forced via `index.html` inline script and `ThemeProvider`. No theme toggle exists.
