# Mobile Backlog — Replicate Web (Tasker/Lawyer) Features in LexOneAndroid / LexOneIOS

This file is written as a prompt for coding agents working in `LexOneAndroid` or `LexOneIOS`.
It describes web-only features built in `LexOneWeb-API/web_src` (React) since the LexOne rebrand that
have no mobile equivalent yet. Each section below is self-contained — paste it to an agent working
in the relevant mobile repo, along with the cited web source files for exact field names/behavior.

All of these features are currently implemented against **mock data only** (no backend endpoints exist
yet — see `web_src/src/utils/mockAuth.js` and `web_src/src/utils/aiLawyerMatch.js`). When replicating
on mobile, build the UI/navigation now using the same shape of mock/static data, and wire to the real
API once `node_api` / Laravel endpoints are implemented (do not invent endpoint contracts — flag them
as TODO same as the web code does, see `CalendarPage.js`'s commented-out `axios.get(...)` block for the
pattern to follow).

---

## 1. Tasker "Clients" module (new)

**Why:** Lawyers (taskers) need a CRM-lite view of their clients, separate from the generic booking list.

**Screens to add:**
- **Client List** — grid/list of all clients for the logged-in lawyer, showing avatar initials, name, and
  number of active cases. Reference: `web_src/src/Pages/Tasker/Clients/ClientList.js`.
- **Client Detail** — client contact info (name, email, phone, address), list of their cases (linking to
  Case Detail), a free-text "Notes" field the lawyer can edit and save (persisted per-client), and a
  "Chat" action to open the conversation with that client. Reference:
  `web_src/src/Pages/Tasker/Clients/ClientDetail.js`.

**Data shape** (see `MOCK_CLIENTS` in `web_src/src/utils/mockAuth.js`): `client_id`, `name`, `email`,
`phone`, `address`, `chat_id`, `case_ids` (array).

**Entry points:** Tasker home dashboard shows a "Mis Clientes" preview section (first 4 clients) linking
to the full list — see item 4 below.

---

## 2. Tasker "Cases" module (new)

**Why:** Each lawyer engagement is tracked as a legal "case" — distinct from a generic task/booking —
with its own documents and now an activity history.

**Screens to add:**
- **Case List** — table/list of cases with reference ID, client name, status badge (`En curso`/
  `Aceptado`/`Completado`/`Pendiente`), and created date. Reference:
  `web_src/src/Pages/Tasker/Cases/CaseList.js`.
- **Case Detail** — case info card (ID, opening date, status, description), linked client card, and:
  - **Document list** with type/version/date, plus an "upload document" flow (pick a document type from
    a fixed legal-document-type list, attach a file, auto-incrementing version number per type).
  - **Activity history table (NEW — just added to web, not yet on mobile at all):** a chronological table
    of interactions tied to the case — e.g. "Visita al juzgado" (court visit), "Cita con cliente" (client
    appointment), phone calls, notarial visits. Each row shows **date, category, type, and a
    description/notes preview truncated to 300 characters**. Tapping a row opens a detail view (drawer on
    web; should be a bottom sheet or push screen on mobile) showing the **full, untruncated** description
    and notes plus date/category/type.
    Reference implementation: `web_src/src/Pages/Tasker/Cases/CaseDetail.js` (look for `activities`,
    `ACTIVITY_DESC_LIMIT = 300`, `truncate()`, and the `Drawer` markup). Mock data shape: see the
    `activities` array added to each entry in `MOCK_CASES` in `mockAuth.js` — fields are `activity_id`,
    `category`, `type`, `date`, `description`, `notes`.

**Entry points:** Tasker home dashboard "Total Tasks" stat card now links to `/tasker/cases` (was a
static, non-clickable card before — see item 4).

---

## 3. Tasker "Calendar" module (new)

**Why:** Lawyers need to see upcoming appointments (client meetings, online vs. in-person) in one place.

**Screen to add:** Calendar/agenda view listing appointments with title, client name/link, date, time,
type (`online` with a meeting link, or in-person with a location), and notes. Tapping an appointment
opens a modal/detail with full info. Reference: `web_src/src/Pages/Tasker/Calendar/CalendarPage.js`.
Data shape: `MOCK_APPOINTMENTS` in `mockAuth.js` — `appointment_id`, `title`, `client_id`, `client_name`,
`case_id`, `reference_id`, `date`, `time`, `type`, `link`, `location`, `notes`.

**Entry points:** Tasker home dashboard shows a "Próximas citas" preview section (first 4 appointments)
linking to the full calendar.

---

## 4. Tasker Home Dashboard changes

**Why:** The dashboard stat cards were static; now they're actionable, and two new preview sections were
added so lawyers can jump straight into the new modules.

**Changes to replicate:**
- All 5 stat cards (Total Tasks, Accepted, Earnings, Completed, Pending Earnings) are now tappable links:
  - Total Tasks → Cases list
  - Accepted / Completed / Pending Earnings / Total Earnings → My Bookings
- New "Mis Clientes" section: shows up to 4 client cards (avatar initials + name + case count) with a
  "View all" link to the Clients list. Hidden if there are no clients.
- New "Próximas citas" section: shows up to 4 upcoming-appointment cards (colored dot for online vs.
  in-person, title, client name, date) with a "View all" link to Calendar. Hidden if there are no
  appointments.

Reference: `web_src/src/Pages/Tasker/TaskerHome/TaskerHome.js`.

---

## 5. "Find Lawyers" — AI-assisted lawyer search (new, consumer-facing)

**Why:** New top-level entry point for clients (not taskers) to describe their legal problem in plain
language and get matched to relevant lawyers, instead of (or alongside) browsing/searching categories.

**Screen to add:** A chat-style search screen:
- Client types a free-text description of their legal issue.
- The "AI" (currently simulated client-side — see below) returns a short list of matched lawyer cards:
  name/initials, specialty, rating, location, price range, short bio.
- Reference: `web_src/src/Pages/User/FindLawyers.js` for the conversational UI/flow, and
  `web_src/src/utils/aiLawyerMatch.js` for `simulateAiLawyerMatch()` — a keyword-matching function against
  a static `MOCK_LAWYERS_DIRECTORY` (specialty + keywords per lawyer). This is explicitly a stand-in for a
  real backend/LLM endpoint — replicate the UX/flow on mobile using the same local simulation for now;
  do not block mobile work on a real AI backend existing.
- Entry point: new "Find Lawyers" nav link in the header (was previously an in-page anchor scroll to a
  search widget; now it's a dedicated route/screen) — see `web_src/src/components/Header.js` diff
  (`<Link to="/find-lawyers">` replacing `<a href="#lexone-search">`).

---

## 6. Account Settings — "Delete Account" relocation

**Why:** UX cleanup, not a new feature, but a placement fix worth mirroring for consistency.

**Change:** In the user profile/account sidebar, "Delete Account" button moved out of the menu-list
drawer (where it sat above Logout) and now appears inside the **Account Settings** panel, below the
account settings form, instead of in the main profile sidebar menu. Reference:
`web_src/src/components/headerModules/profileSideBar.js` diff. Replicate by moving the equivalent
"Delete Account" action from the main account/profile menu screen into the Account Settings/Edit Profile
screen on mobile, if it currently lives in the top-level menu.

---

## 7. Mock-auth / mock-data pattern (context for agents, not a feature to build)

The web app added a `isMockToken(token)` pattern (`mockAuth.js`) that short-circuits real API calls and
returns static mock data when the user is logged in with a special mock token — used to demo
Cases/Clients/Calendar/Dashboard previews without a working backend. **This is a web-dev-only
convenience and should NOT be replicated on mobile** — mobile agents should build against the real API
once available, or use whatever existing mock/staging pattern already exists in the Android/iOS repos.
It's mentioned here only so mobile agents understand why some web field names/shapes (e.g. `activities`,
`appointments`, `case_ids`) only exist in mock fixtures today and have no backend contract yet — those
contracts will need to be defined when the corresponding Laravel/node_api endpoints are built.

---

## Suggested order of work

1. Cases module (list + detail + document upload + **activity history table & detail view**) — most
   requested, has the richest mock data already modeled.
2. Clients module (list + detail + notes).
3. Tasker Home dashboard updates (clickable cards + Clients/Calendar preview sections) — depends on 1 & 2.
4. Calendar module.
5. Find Lawyers (consumer-facing, independent of the tasker work above — can be parallelized).
6. Delete Account relocation (small, independent, do anytime).
