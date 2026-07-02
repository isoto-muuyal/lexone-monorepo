# LexOne New Endpoints Reference

Documents the endpoints added for the **Despacho (legal office) accounts** and
**Cases sharing/creation** work. All routes are prefixed with
`/web/api/v1` (i.e. `${REACT_APP_BASE_URL}/web/api/v1/...`).

**Auth header convention:** every protected route reads the JWT from the raw
`Authorization` header — **no `Bearer ` prefix** (e.g.
`Authorization: <access_token>`), matching the rest of this API.

---

## Despacho (Legal Office) Accounts

A despacho is a group account managed by an "asistente" that can onboard up
to `maxSeats` (default 10) lawyers who share clients/cases. Sign-in is
two-stage: **(1)** the despacho's generic office email + password (shared by
everyone in the office) gets you a despacho-role token, then **(2)** the
person picks who they are from the roster and confirms their own 4-digit PIN
(unique per assistant/lawyer) to actually reach a dashboard. The password is
never shared between people — only the PIN distinguishes identities.

### `POST /despacho/signup`
Creates a new despacho (asistente) account. No phone/OTP collected.

- **Auth:** none
- **Body** (urlencoded): `contact_name`, `contact_email`, `password` (min 6 chars, shared office login), `pin` (4 digits, the assistant's own identity PIN), `address`, `office_address`
- **Response:**
  ```json
  { "status_code": 200, "user_id": "...", "access_token": "...", "name": "...", "email": "...", "type": "despacho" }
  ```
- **Use for:** the "Soy Despacho" signup screen. Store `access_token`/`user_id` and treat this session like any other login — `type: "despacho"` is the role to branch UI on.

### `POST /despacho/signin`
**Stage 1.** Signs in with the despacho's office email + password (not PIN — every person in the office shares this login).

- **Auth:** none
- **Body** (urlencoded): `email`, `password`
- **Response:** same shape as signup.
- **Use for:** despacho login screen. After this call, fetch `/despacho/roster` to show the "choose who you are" picker (assistant vs. one of the lawyers) — this token alone only grants despacho-role endpoints (`roster`, `assistantsignin`, `lawyersignin`, `addlawyer`), not a dashboard.

### `GET /despacho/roster`
Lists the despacho's own identity plus every lawyer added under it.

- **Auth:** despacho JWT (`Authorization: <despacho access_token>`)
- **Response:**
  ```json
  {
    "status_code": 200,
    "assistant": { "user_id": "...", "name": "..." },
    "lawyers": [
      { "user_id": "...", "name": "...", "email": "...", "areas_of_expertise": ["..."], "status": 1 }
    ]
  }
  ```
- **Use for:** the post-signin picker screen — render the assistant row and one row per lawyer; clicking either reveals that identity's PIN input (stage 2).

### `POST /despacho/assistantsignin`
**Stage 2 (assistant identity).** Confirms the assistant's own PIN after the password sign-in above.

- **Auth:** despacho JWT
- **Body** (urlencoded): `pin`
- **Response:** same shape as `/despacho/signin` (a fresh despacho-role token).
- **Use for:** clicking the assistant row in the roster picker → enter PIN → `Enter` key or button submits → on success, navigate to the despacho/assistant dashboard.

### `POST /despacho/lawyersignin`
**Stage 2 (lawyer identity).** Signs a specific lawyer (under this despacho) into a normal **tasker**-role session, using their own PIN. This is how a lawyer "becomes themselves" after the office password sign-in.

- **Auth:** despacho JWT
- **Body** (urlencoded): `tasker_id` (the lawyer's `user_id` from the roster), `pin`
- **Response:**
  ```json
  {
    "status_code": 200,
    "user_id": "...",
    "access_token": "...",
    "name": "...",
    "email": "...",
    "user_image": "...",
    "location": "...",
    "type": "tasker",
    "despacho_id": "..."
  }
  ```
- **Use for:** after this call, store the session exactly like a normal lawyer login and navigate into the **same tasker dashboard/Cases/Clients screens used by independent lawyers** — no separate UI needed. `despacho_id` on the session is the signal that this tasker belongs to a despacho (used to show the "share with colleagues" UI in Cases — see below).

### `POST /despacho/addlawyer`
Adds a new lawyer under the despacho (the "Agregar abogado" flow), up to the seat cap.

- **Auth:** despacho JWT
- **Body** (`multipart/form-data`): `name`, `email`, `pin` (4 digits), repeated `areas_of_expertise` fields (one per area), up to 5 `files` (credential documents)
- **Response (success):**
  ```json
  { "status_code": 200, "user_id": "...", "name": "...", "email": "...", "areas_of_expertise": ["..."] }
  ```
- **Response (seat cap reached, `status_code": 409`):**
  ```json
  { "status_code": 409, "message": "Seat limit reached", "lawyer_seat_price": "..." }
  ```
- **Use for:** the assistant-dashboard "add lawyer" form. On `409`, show an upsell message using `lawyer_seat_price` (read from `Setting`/`/appdefaults`) instead of a hard error — there is no payment/checkout flow yet, this is just the price signal.

---

## Cases

Cases belong to a `tasker_id` (the creating lawyer) and can additionally be
shared with despacho colleagues via `assigned_tasker_ids`. A tasker without a
despacho only ever sees/owns their own cases.

### `POST /tasker/cases`
Creates a new case. *(New this session — previously there was no case-creation endpoint.)*

- **Auth:** tasker/despacho JWT (`commonJwt`)
- **Body** (urlencoded): `tasker_id`, `reference_id` (required), `client_id` (optional), `client_name` (optional), `description` (optional), `status` (optional, defaults to `"started"`)
- **Response:**
  ```json
  { "status_code": 200, "case": { "case_id": "...", "tasker_id": "...", "assigned_tasker_ids": ["..."], "reference_id": "...", "client_id": null, "client_name": "...", "description": "...", "status": "started", "created_date": "YYYY-MM-DD", "documents": [] } }
  ```
- **Use for:** the "new case" form. The creating `tasker_id` is automatically added to `assigned_tasker_ids`, so the creator always sees their own case in `listCases`.

### `GET /tasker/cases/:tasker_id`
Lists every case visible to this tasker: their own cases, plus any despacho colleagues' cases they were assigned to.

- **Auth:** `commonJwt`
- **Use for:** the Cases list screen.

### `GET /tasker/cases/:tasker_id/:case_id`
Fetches one case's full detail (including embedded `documents`).

- **Auth:** `commonJwt`
- **Use for:** the Case detail screen.

### `GET /tasker/cases/:tasker_id/colleagues`
Returns the requesting tasker's despacho colleagues (empty array if they're not part of a despacho). *(New this session.)*

- **Auth:** `commonJwt`
- **Response:**
  ```json
  { "status_code": 200, "colleagues": [ { "user_id": "...", "name": "...", "email": "..." } ] }
  ```
- **Use for:** populating the "share with colleagues" multi-select on the Case detail screen. If `colleagues` is empty, hide that UI entirely — the tasker has no despacho.

### `POST /tasker/cases/:case_id/assign`
Sets which despacho colleagues (in addition to the owner) a case is shared with.

- **Auth:** `commonJwt`
- **Body** (urlencoded): `tasker_id` (must be the case's owner), `assigned_tasker_ids` (array — send as repeated `assigned_tasker_ids` fields)
- **Validation:** every id in `assigned_tasker_ids` must belong to the same despacho as `tasker_id`, or the call fails with `400`.
- **Response:** `{ "status_code": 200, "case": { ...same shape as createCase... } }`
- **Use for:** the "Compartir con colegas" save action on the Case detail screen.

### `GET /tasker/cases/:case_id/documents`
Lists a case's documents. (Documents are also already embedded in the `getCase`/`listCases` response — this is a standalone fetch if needed.)

- **Auth:** `commonJwt`
- **Query:** `tasker_id`

### `POST /tasker/cases/:case_id/documents`
Uploads a new document version to a case.

- **Auth:** `commonJwt`
- **Body** (`multipart/form-data`): `tasker_id`, `doc_type` (one of the document type labels, e.g. `"Contrato de Compraventa"`), `file`
- **Versioning:** the version number auto-increments per `doc_type` within the case (first upload of a type = v1, next = v2, etc).
- **Response:** `{ "status_code": 200, "document": { "doc_id": "...", "type": "...", "version": 1, "file_name": "...", "file_url": "...", "date": "YYYY-MM-DD" } }`
- **Use for:** the document upload UI on the Case detail screen. Stores `file_size_bytes` (from multer) on the document, which feeds the tasker storage-usage calculation used by `GET /tasker/plan/:tasker_id` below.

---

## Admin Panel

Admin accounts have no public signup — they're seeded directly
(`node_api/scripts/seedAdmin.js`) since this is an internal/staff role, not
self-serve. Web UI lives at `/admin/admin-login` → `/admin/dashboard`.

### `POST /admin/signin`
Signs in an admin with email + password.

- **Auth:** none
- **Body** (urlencoded): `email`, `password`
- **Response:** `{ "status_code": 200, "user_id": "...", "access_token": "...", "name": "...", "email": "...", "type": "admin" }`
- **Use for:** the Admin Login screen.

### `GET /admin/users`
Lists users for the admin user table.

- **Auth:** admin JWT (`Authorization: <admin access_token>`)
- **Query (optional filters):** `role` (`user`/`tasker`/`despacho`/`admin`), `plan` (`trial`/`basic`/`pro`)
- **Response:** `{ "status_code": 200, "users": [ { "user_id": "...", "name": "...", "email": "...", "role": "...", "plan": "...", "status": 1 } ] }`
- **Use for:** the Users tab table + filter dropdowns.

### `GET /admin/users/export`
Downloads the same user set as a CSV file.

- **Auth:** admin JWT
- **Response:** `Content-Type: text/csv`, `Content-Disposition: attachment` — columns `id,name,email,role,plan,status,created`.
- **Use for:** the "Export CSV" button (frontend downloads via `axios` `responseType: 'blob'` + a temporary `<a download>`).

### `POST /admin/users/:user_id/freeze`
Freezes a user account (`status: 0`) — blocks sign-in without deleting data.

- **Auth:** admin JWT
- **Response:** `{ "status_code": 200 }`

### `POST /admin/users/:user_id/unfreeze`
Reactivates a frozen account (`status: 1`).

- **Auth:** admin JWT
- **Response:** `{ "status_code": 200 }`

### `DELETE /admin/users/:user_id`
Soft-deletes a user account (`status: 2`).

- **Auth:** admin JWT
- **Response:** `{ "status_code": 200 }`

### `POST /admin/users/:user_id/plan`
Admin manually overrides a tasker's subscription plan — stands in for real billing since there's no payment processor yet.

- **Auth:** admin JWT
- **Body** (urlencoded): `plan` (`trial`/`basic`/`pro`)
- **Response:** `{ "status_code": 200, "plan": "..." }`
- **Use for:** the per-row plan `Select` in the Users tab.

### `GET /admin/pricing`
Reads the pricing/limits fields from the `Setting` document.

- **Auth:** admin JWT
- **Response:** `{ "status_code": 200, "basic_plan_price": "...", "pro_plan_price": "...", "lawyer_seat_price": "...", "trial_days": 30, "basic_storage_limit_mb": 500, "pro_storage_limit_mb": 5120 }`

### `POST /admin/pricing`
Updates the pricing/limits fields.

- **Auth:** admin JWT
- **Body** (urlencoded): same fields as the `GET` response (minus `status_code`)
- **Response:** same shape as `GET /admin/pricing`
- **Use for:** the Pricing tab save action.

---

## Tasker Subscription Plan

Every tasker (lawyer) gets a 1-month trial on signup (`status: 'trial'`,
`trialEndsAt` set from `Setting.trialDays`), then must pick **Basic** (free
profile, chat, 500MB storage, appears in search, can take clients) or
**Pro** (top-of-search placement, 5GB storage, required for despacho/legal-office
membership). Lawyers added via despacho `addlawyer` get `plan: "pro"`
directly, skipping the trial. **No real payment processor this phase** —
plan state and storage limits only; admin can override via `/admin/users/:user_id/plan`
above.

### `GET /tasker/plan/:tasker_id`
Returns the tasker's current plan, trial countdown, and storage usage.

- **Auth:** `commonJwt`
- **Response:**
  ```json
  {
    "status_code": 200,
    "plan": "trial",
    "trial_ends_at": "2026-07-20T00:00:00.000Z",
    "trial_days_remaining": 12,
    "storage_used_mb": 38,
    "storage_limit_mb": 500
  }
  ```
- **Use for:** the Account Plan screen (trial countdown, storage bar, plan cards). `storage_used_mb` is computed on-demand by summing `file_size_bytes` across the tasker's own case documents.

### `POST /tasker/plan/:tasker_id`
Tasker picks `basic` or `pro` directly — no payment step.

- **Auth:** `commonJwt`
- **Body** (urlencoded): `plan` (`basic`/`pro`)
- **Response:** `{ "status_code": 200, "plan": "..." }` on success, or `{ "status_code": 400, "message": "..." }` on failure.
- **Use for:** the "Choose Plan" buttons on the Account Plan screen.
