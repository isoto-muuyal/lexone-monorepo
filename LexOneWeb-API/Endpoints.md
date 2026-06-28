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
to `maxSeats` (default 10) lawyers who share clients/cases. Despacho and
despacho-added-lawyer accounts authenticate with a 4-digit PIN instead of a
password.

### `POST /despacho/signup`
Creates a new despacho (asistente) account. No phone/OTP collected.

- **Auth:** none
- **Body** (urlencoded): `contact_name`, `contact_email`, `pin` (4 digits), `address`, `office_address`
- **Response:**
  ```json
  { "status_code": 200, "user_id": "...", "access_token": "...", "name": "...", "email": "...", "type": "despacho" }
  ```
- **Use for:** the "Soy Despacho" signup screen. Store `access_token`/`user_id` and treat this session like any other login — `type: "despacho"` is the role to branch UI on.

### `POST /despacho/signin`
Signs in an existing despacho with email + PIN (not password).

- **Auth:** none
- **Body** (urlencoded): `email`, `pin`
- **Response:** same shape as signup.
- **Use for:** despacho login screen. After this call, fetch `/despacho/roster` to show the "choose who you are" picker (assistant vs. one of the lawyers) before navigating anywhere — this token alone only grants despacho-role endpoints (`roster`, `lawyersignin`, `addlawyer`), not the tasker dashboard.

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
- **Use for:** the post-signin picker screen — render the assistant row (→ assistant dashboard) and one row per lawyer (→ prompts for that lawyer's PIN, then calls `lawyersignin`).

### `POST /despacho/lawyersignin`
Signs a specific lawyer (under this despacho) into a normal **tasker**-role session, using their PIN. This is how a lawyer "becomes themselves" after the despacho's assistant has already signed in.

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
- **Use for:** the document upload UI on the Case detail screen.
