# Shunn Labs — web app

Marketing site, authentication screens, and the mission-control dashboard.

React 19 · TypeScript · Vite · Tailwind v4 · React Router

## Running locally

The app needs the auth service running alongside it:

```bash
cd ../Shuun_Auth_Server && ./run.sh          # terminal 1 → :8001
```

```bash
npm install && npm run dev                    # terminal 2 → :5174
```

Then open <http://localhost:5174>.

Configuration (`.env.local`, copy from `.env.example`):

```dotenv
VITE_AUTH_API_URL=http://localhost:8001
```

Scripts: `npm run dev` · `npm run build` (typechecks first) · `npm run lint`

## Routes

| Path | Access | What it is |
| --- | --- | --- |
| `/` | public | Landing page |
| `/team` | public | Team page |
| `/signup` | public | Create an account — email/password or Google |
| `/login` | public | Sign in |
| `/welcome` | **authenticated** | Post-sign-in landing, with a link into the dashboard |
| `/dashboard` | **authenticated** | Mission control |

Protected routes sit behind `ProtectedRoute`, which waits for session
restore before deciding — otherwise a hard refresh would bounce a signed-in
user to `/login`. An anonymous visit redirects to `/login?next=<path>` and
returns there after signing in.

> The route guard is a **UX** guard: it decides what to render, not what
> data exists. Every protected resource is authorized server-side too.

## Authentication

Sessions live in httpOnly cookies set by the auth service, so no token is
ever readable by JavaScript. `src/lib/auth/` holds the pieces:

- `client.ts` — typed API client. Sends `credentials: 'include'`, attaches
  the `X-CSRF-Token` header on unsafe methods, normalises errors into
  `ApiError`.
- `context.ts` — the React context and its types.
- `AuthContext.tsx` — the provider: restores the session on load and
  silently rotates the access token a minute before it expires.
- `useAuth.ts` — the hook.

Google sign-in is a full-page redirect into the backend
(`/api/auth/google/authorize`), which is what lets the server run the
Authorization Code + PKCE exchange and set cookies on a real navigation.
See the auth server README for how to obtain Google credentials.

## Dashboard

`/dashboard` talks to the Nandi services (`api.shuun.site`,
`vision.shuun.site`), which are **separate** from the auth service and
carry their own bearer token — set it from the "Session" panel in the
dashboard top bar. Signing in here does not authenticate you there.

- `SensorGrid` — renders however many sensors the feed reports. Tries
  `/ws/sensors`, falls back to polling `/api/sensors`, then to a built-in
  simulator (labelled as such in the UI).
- `StreamGrid` — WebRTC tiles from vision-agent commands, manual or
  discovered stream ids, and this device's own camera.
- `AssistantChat` — chat, attachments, mic/STT, spoken replies.

## Layout

```
src/
  components/
    auth/       AuthShell, FormField, GoogleButton, ProtectedRoute
    dashboard/  sensor grid, stream grid, chat, activity log, top bar
    icons/      shared SVG icons
  lib/
    auth/       session client, context, hook
    nandi/      brain socket, vision control, WebRTC, sensors, speech
  pages/        Landing, Team, Signup, Login, Welcome, Dashboard
```

## Deployment

Vercel builds and deploys on every push to `main`; `vercel.json` rewrites
all paths to `index.html` so client-side routes work. GitHub Actions runs
typecheck, lint and build as a gate — `vite build` alone does not fail on
type errors, so Vercel would happily ship one.

Production environment variable (Vercel → Settings → Environment Variables):

```dotenv
VITE_AUTH_API_URL=https://auth.shuun.site
```

> `VITE_*` values are compiled into the client bundle and are **public**.
> Never put a secret behind that prefix.

The frontend is served from `app.shuun.site` and the auth API from
`auth.shuun.site`. Sharing the registrable domain makes them **same-site**,
which is what lets session cookies stay `SameSite=Lax` — the browser then
blocks cross-site CSRF itself. Moving the frontend to a different
registrable domain (including `*.vercel.app`) would force
`SameSite=None` and give that protection up.

The auth service's `CORS_ORIGINS` and `FRONTEND_URL` must name this site's
exact origin, or cookies will be rejected. Full runbook:
[`Shuun_Auth_Server/DEPLOYMENT.md`](../Shuun_Auth_Server/DEPLOYMENT.md).
