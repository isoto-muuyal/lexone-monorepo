# LexOneWeb-API — Infrastructure

Reference for every external/managed service this project depends on:
where it lives, who owns it, and what touches it. Companion to
[AGENTS.md](./AGENTS.md) (code/dev context) and to the cross-project
deploy pattern at `~/infra-notes/aws-ec2-cicd.md` (not in this repo —
local reference doc, same author).

## Hosting: AWS EC2 (`muuyal.tech`)

- Single EC2 box, account `457335975306`, region `us-east-2`, host
  `muuyal.tech` (Elastic IP `3.15.106.208` as of 2026-06-23 — also serves
  several unrelated personal apps).
- App folders: `/home/ubuntu/apps/lexone-api/` (`.env` + `docker-compose.yml`)
  and `/home/ubuntu/apps/lexone-web/` (`docker-compose.yml`, no secrets —
  build-time env is baked into the image).
- Containers are **not cost-incremental** — they run on the existing box,
  no new EC2 instance was created for this project.
- Host ports used (already-taken ports on this box ruled out at setup time:
  3000-3001, 5000-5003, 5050, 6379, 8080, 9090):
  - `4000` → `lexone-web` (nginx, container port 80)
  - `4001` → `lexone-api` REST (container port 3000)
  - `4002` → `lexone-api` chat/socket.io (container port 8081)
- System nginx (not containerized) + Certbot terminate TLS per subdomain.
  Vhosts: `/etc/nginx/sites-available/{lex-one.online,api.lex-one.online,ws.lex-one.online}`.

## Container registry: AWS ECR

- Repos `lexone-api` and `lexone-web`, region `us-east-2`.
- **Cost note:** ECR has no free tier for storage — minor cost
  (~$0.10/GB-month) accrues per image pushed. Old images aren't
  auto-pruned; periodically run `aws ecr list-images --repository-name
  lexone-api` and delete stale tags if storage creep becomes noticeable.
  No other new billable AWS resources were created (no new EC2 instance,
  no new Elastic IP, no RDS) — this reuses the existing box.

## CI/CD: GitHub Actions (split repos)

The original `lexone-monorepo` was split into standalone repos per
STORY-013; each has its own deploy pipeline now:

- `isoto-muuyal/lexone-api` ← `node_api/`, deploys to `/home/ubuntu/apps/lexone-api/`
- `isoto-muuyal/lexone-web` ← `web_src/`, deploys to `/home/ubuntu/apps/lexone-web/`

Each repo's `.github/workflows/deploy.yml` builds its image, pushes to its
ECR repo, uploads `deploy/docker-compose.yml` to its EC2 folder, then
`docker compose pull && up -d` over SSH on push to `main`. Both confirmed
working end-to-end. Repo secrets (set independently on each repo):

| Secret | Purpose |
|---|---|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | **Currently the account's admin IAM user creds** (reused from local `aws configure`), not a scoped CI-only user. Matches what's already done on other repos in this account, but worth tightening later to an ECR-push-only IAM user if this project's risk profile changes. |
| `AWS_REGION` | `us-east-2` |
| `ECR_REPOSITORY` | `lexone-api` (on the api repo) / `lexone-web` (on the web repo) |
| `EC2_HOST` / `EC2_USERNAME` / `EC2_SSH_KEY` / `EC2_PORT` | SSH target for deploy |
| `REACT_APP_GOOGLE_MAP_API_KEY`, `REACT_APP_FIREBASE_*` (web repo only) | Frontend build-time vars (see Firebase section) — these end up in the public JS bundle regardless, stored as secrets only to keep them out of the tracked workflow file |

The EC2 box itself pulls from ECR via an **instance IAM role**
(`Role-AmazonEC2ContainerRegistryReadOnly-forEC2Instance`), not the secrets
above — no AWS credentials are written to disk on the box.

## Database: MongoDB Atlas

- Org `Israel's Org - 2025-08-18`, project `LexOneWeb-API`
  (`6a3b0e8ba77655140abb895a`), cluster `lexone-prod`
  (`lexone-prod.9qsnoxa.mongodb.net`, region US_EAST_1/AWS).
- **Tier: M0 (free)** — $0/month as long as it stays on this tier. Atlas
  will email before any forced tier change; don't accept an upgrade
  prompt without checking cost first.
- DB user `lexone_api` (`readWriteAnyDatabase`). Password is **not
  retrievable** after creation — currently lives only in
  `/home/ubuntu/apps/lexone-api/.env` (chmod 600) on the box. Back it up
  to a password manager; if lost, reset via `atlas dbusers update`.
- Network access list: locked to the EC2 box's Elastic IP only
  (`3.15.106.208/32`). Any new server needing DB access must be added to
  this list in Atlas first.
- Database name in use: `lexone_new` — empty/fresh, **not** a migration
  of the old production data. The legacy prod DB (`tudo_new`) lives on a
  separate, older server (`tudofyapp.com`, `mongodb://tudo_root:...@localhost:29098/tudo_new`)
  and has not been migrated here. Decide if/when to migrate before
  treating this Atlas cluster as the real production datastore.

## Supabase — not used by this project

The author has a Supabase account/free-tier project used elsewhere, but
Supabase is Postgres-only and this project (`node_api`) is Mongoose/MongoDB
— mismatched, so Supabase was ruled out in favor of Atlas. Documented here
only to prevent a future session from re-investigating the same dead end.

## Email: AWS SES (SMTP) + MailerSend

Two mailers are present in `node_api/src/controllers/mailController.js`:

- **AWS SES SMTP** — credentials via env vars (`SES_SMTP_HOST/PORT/USER/PASS`,
  `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`), already set in the EC2 `.env`.
- **MailerSend** — ⚠️ **the API keys are hardcoded directly in
  `mailController.js` (lines ~84 and ~207)**, not read from env. This is a
  pre-existing issue (not introduced by this deploy work) but is a real
  secret-in-source-control exposure — flagged here so it gets fixed
  (move to `MAILERSEND_API_KEY` env var, rotate the key) rather than
  silently carried forward.

## Firebase + Google Maps (frontend, `web_src`)

Client-side API keys (Firebase project `modular-bucksaw-421523`, Google
Maps key) — baked into the React build at image-build time via Docker
build-args, sourced from the GitHub secrets listed above. These are
public-facing keys by nature (visible in any browser's bundle); storing
them as secrets only avoids hardcoding in the tracked workflow YAML, not
true confidentiality. Restrict them by HTTP referrer/domain in the
Firebase/Google Cloud console if not already done.

## Domain: `lex-one.online`

All four hostnames resolve to `3.15.106.208` and have valid Let's Encrypt
certs (expire 2026-09-22, auto-renew configured via certbot):

- `lex-one.online` / `www.lex-one.online` → `localhost:4000` (web)
- `api.lex-one.online` → `localhost:4001` (api REST)
- `ws.lex-one.online` → `localhost:4002` (api chat/socket.io)

`https://lex-one.online` confirmed serving the real React app (200).
`api.`/`ws.` return 404 at `/` over HTTPS — expected, those apps have no
root route, not a deploy issue.
