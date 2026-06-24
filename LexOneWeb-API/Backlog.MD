# LexOne Backlog (canonical, story-tracked)

Each story has an id, description, and status. This file is the source of
truth for status going forward — `APIBacklog.md` (technical endpoint specs)
and `MobileBacklog.MD` (mobile-specific detail) remain as reference detail
underneath these stories, not separate tracking.

Status values: `Done`, `In Progress`, `Todo`, `Blocked`.

| ID | Description | Status | Notes |
|---|---|---|---|
| STORY-001 | Clients backend: list/get clients, save lawyer-private notes (`node_api/models/clientModel.js`, `controllers/web/clientController.js`, `routes/clients.js`) | Done | See `APIBacklog.md` §1 |
| STORY-002 | Cases + Documents backend: list/get cases, list/upload versioned documents (`caseModel.js`, `caseController.js`, `routes/cases.js`, `middlewares/upload.js`) | Done | See `APIBacklog.md` §2-3. Local disk storage via multer, no S3 configured |
| STORY-003 | Calendar backend: weekly availability, manual blocks, public slot generation, appointment scheduling (online/cash payment), Stripe webhook, revenue aggregation | Done | See `APIBacklog.md` §4 |
| STORY-004 | Frontend: switch Clients/Cases/Calendar pages from `mockAuth.js` mock data to the real `node_api` endpoints | Todo | One page at a time, per `APIBacklog.md` "Frontend switch" notes |
| STORY-005 | `agent_api/` — standalone Python/FastAPI service, Gemini-backed, `/agent/chat` endpoint, replaces `simulateAiLawyerMatch` in `web_src/src/utils/aiLawyerMatch.js` | Todo | Not started. Decided: own service, not bolted into `node_api`, not MCP |
| STORY-006 | Mobile (Android/iOS): Clients module — list/detail screens | Todo | Mirrors STORY-001. See `MobileBacklog.MD` §1 |
| STORY-007 | Mobile (Android/iOS): Cases module — list/detail, document management, activity history | Todo | Mirrors STORY-002. See `MobileBacklog.MD` §2 |
| STORY-008 | Mobile (Android/iOS): Calendar module — agenda view for appointments | Todo | Mirrors STORY-003. See `MobileBacklog.MD` §3 |
| STORY-009 | Mobile (Android): Tasker Home Dashboard — tappable stat cards, "Mis Clientes" preview | In Progress | "Próximas citas" preview still pending. See `MobileBacklog.MD` §4 |
| STORY-010 | Mobile (Android): "Find Lawyers" AI-assisted search entry point + chat screen | In Progress | Entry point added; conversational screen is a placeholder pending STORY-005 |
| STORY-011 | Mobile (Android): Relocate "Delete Account" from main profile menu to bottom of Edit Profile settings | Done | See `MobileBacklog.MD` §6 |
| STORY-012 | Legacy PHP/Laravel admin panel (business-owner admin, lives at `LexOneWeb-API` root: `app/`, `routes/`, `vendor/`, etc.) — refactor/modernize | Todo | Confirmed still in active use (not dead code) — admin panel for the business owner. Scope/target stack not yet decided |
| STORY-013 | Split `lexone-monorepo` into separate repos: `lexone-web` (web_src), `lexone-api` (node_api), `lexone-ios`, `lexone-android` | In Progress | Fresh history (no secrets carried over) for web/api. Android already has its own repo (`TudoAndroidv2`) and remote; iOS has local history, no remote yet |
| STORY-014 | Deploy infra: AWS ECR + EC2 (`muuyal.tech`) + MongoDB Atlas + nginx/Certbot for `lex-one.online` | Done | `lexone-api` and `lexone-web` both deploy end-to-end (ECR build/push → EC2 pull/up). All 4 domains live with valid TLS: `lex-one.online`, `www.lex-one.online` (web, 200), `api.lex-one.online`, `ws.lex-one.online` (api/socket, 404 root is expected — no root route). See `INFRA.md` |
| STORY-015 | Security: MailerSend API keys are hardcoded in `node_api/src/controllers/mailController.js` (not env-based) | Todo | Move to `MAILERSEND_API_KEY` env var and rotate the exposed key |
| STORY-016 | Security: legacy `lexone-monorepo` repo has real secrets committed in tracked `.env` files (git history) | Todo | Explicitly deferred by the team — revisit separately, not blocking the repo split |
| STORY-017 | Bug: `web_src/package.json` had `homepage: "https://tudofyapp.com/web/"` left over from the old deployment, breaking all static asset loading (404→SPA fallback→`Unexpected token '<'`) once served from `lex-one.online` root | Done | Fixed by setting `homepage: "/"`, redeployed, verified `/static/js/...` and `/manifest.json` now return 200 |
| STORY-018 | Bug: `node_api/src/controllers/cronController.js` crashed every minute (`Cannot read properties of null (reading 'stripeChange')`) because the fresh `lexone_new` DB has no `Setting` document | Done | Added a null guard before `appSettings.stripeChange`; verified no more crash in logs after redeploy. Doesn't address the underlying gap of no seeded Setting doc — may want a seed script later |
