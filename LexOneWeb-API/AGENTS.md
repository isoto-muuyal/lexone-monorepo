# LexOne Web + API — Context for AI Coding Agents

## Scope
This repo covers the **web frontend** (`web_src/`, CRA/React) and **Node API** (`node_api/`, Express + Mongoose + Socket.io). Android (`../LexOneAndroid`) and iOS (`../LexOneIOS`) are separate repos with their own `AGENTS.md`.

## Infrastructure
See [INFRA.md](./INFRA.md) for every external/managed service this project depends on (AWS EC2/ECR, MongoDB Atlas, SES, MailerSend, Firebase, the `lex-one.online` domain/nginx setup) — read it before touching deploy config, `.env` shape, or anything DNS/TLS-related.

## Dev setup
- Frontend: `cd web_src && npm start` (CRA, `NODE_OPTIONS=--openssl-legacy-provider`). Node v24 may hang the dev server before "Compiled successfully!" — use an older Node (18/20) via nvm if it doesn't compile.
- Mock auth: `web_src/.env` has `REACT_APP_MOCK_AUTH=true` — demo login via `mockAuth.js` (`demo.user@lexone.local` / `LexOneDemo123!`). No API needed for frontend-only work.
- Backend: `cd node_api && npm start` (`node ./src/app.js`). The tracked `.env` points `MONGODB_URI` at `localhost:29098` on the prod server (Mongo not exposed) and sets `SSL=1` (reads certs from `/etc/letsencrypt/...`, will crash locally). For local runs: set `SSL=0` (don't commit), tunnel with `ssh -L 29098:127.0.0.1:29098 <user>@<host> -N`, and point at a separate db (e.g. `tudo_test`) instead of `tudo_new`.

## Recent feature work (web)
- New logged-in home dashboard (`components/HomePage/LexOneDashboard.js`): profile card, "Lawyers Contacted" history, inbox preview — driven by mock data in `mockAuth.js` for the demo session, with graceful empty states for real sessions.
- New `/find-lawyers` page (`Pages/User/FindLawyers.js`): chat-style AI assistant. Currently uses a **local simulated matcher** (`utils/aiLawyerMatch.js`, `simulateAiLawyerMatch`) — designed as the swap point for a real backend call.
- Header "Find Lawyers" link now routes to `/find-lawyers` (was previously a dead `#lexone-search` anchor).
- "Delete Account" moved from the main profile drawer into the "My Account" / "Mi Cuenta" drawer (`components/headerModules/profileSideBar.js`), placed below account settings.

## Recent feature work (API)
- Implemented `APIBacklog.md` sections 1-4 in `node_api/` as additive-only code (no existing controllers/routes/models touched):
  - Clients: `models/clientModel.js`, `controllers/web/clientController.js`, `routes/clients.js` — list/get clients, save lawyer-private notes.
  - Cases + documents: `models/caseModel.js` (with embedded, append-only document sub-schema), `controllers/web/caseController.js`, `routes/cases.js` — list/get cases, list/upload documents. Uploads use `multer` (local disk, see `middlewares/upload.js`) saved under `node_api/src/public/documents`, served statically at `DOCS_MEDIA_URL`. No S3 config was present, so this is the storage backend until/unless S3 is wired up.
  - Calendar/availability/appointments/payments: `models/{lawyerAvailabilityModel,calendarBlockModel,appointmentModel,paymentTransactionModel}.js`, `controllers/web/calendarController.js`, `routes/calendar.js` — weekly availability, manual calendar blocks, public slot generation, appointment scheduling with online (Stripe) or cash payment, Stripe webhook, revenue aggregation.
  - All new routes registered in `routes/WebmainRoutev1.js` under `/web/api/v1`, behind `authMiddleware.commonJwt` (same pattern as other tasker routes — ownership is enforced via `tasker_id` param/body matching, not yet validated against the JWT claim).
- Frontend (`web_src`) still reads from `mockAuth.js` mock data for Clients/Cases/Calendar pages — wiring the real endpoints in is a separate follow-up (see "Frontend switch" notes in `APIBacklog.md`).

## Planned next
- `agent_api/` (new, separate Python/FastAPI service, Gemini-backed) will eventually replace `simulateAiLawyerMatch` via a `/agent/chat` endpoint. Not started yet.
- Switch frontend Clients/Cases/Calendar pages from mock data to the new API endpoints, one at a time.
- DNS: add A records for `api.lex-one.online` and `ws.lex-one.online` (apex/`www` already point at the EC2 box), then run `certbot --nginx` for each — see [INFRA.md](./INFRA.md#domain-lex-oneonline).
- Decide if/when to migrate data from the legacy `tudo_new` prod DB into the new Atlas `lexone_new` DB.

## Deploy
- `.github/workflows/deploy.yml` builds `web` and `api` images, pushes to **AWS ECR** (not GHCR), and deploys each to its own folder on the EC2 box (`/home/ubuntu/apps/lexone-api/`, `/home/ubuntu/apps/lexone-web/`) via `deploy/lexone-api/docker-compose.yml` / `deploy/lexone-web/docker-compose.yml`. The API container persists uploaded case documents in a named volume (`api_documents` → `/app/src/public/documents`). Full infra details in [INFRA.md](./INFRA.md).
