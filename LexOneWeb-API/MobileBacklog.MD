# Mobile Backlog — Replicate Web (Tasker/Lawyer) Features in LexOneAndroid / LexOneIOS

This file tracks web-only features that need mobile equivalents. Features are built against mock data until backend endpoints are ready.

**Before building any Despacho or Cases screen, read [Endpoints.md](./Endpoints.md)** — it documents every despacho (legal office) and cases endpoint (auth, request/response shapes, and which screen each one powers).

---

## 1. Tasker "Clients" module (new)
**Status: TODO**
- **Client List** & **Detail** screens.
- Data: `client_id`, `name`, `email`, `phone`, `address`, `chat_id`, `case_ids`.

---

## 2. Tasker "Cases" module (new)
**Status: TODO**
- **Case List** & **Detail** screens.
- Document management & Activity history (chronological interactions).

---

## 3. Tasker "Calendar" module (new)
**Status: TODO**
- Agenda view for appointments (online/in-person).

---

## 4. Tasker Home Dashboard changes
**Status: IN PROGRESS (Android)**
- [x] Stat cards (Total Tasks, Accepted, Earnings, Completed, Pending Earnings) are tappable links.
- [x] "Mis Clientes" preview section (Android UI entry point added).
- [ ] "Próximas citas" preview section.

---

## 5. "Find Lawyers" — AI-assisted search
**Status: IN PROGRESS (Android)**
- [x] Top-level entry point on Home screen (Android card added).
- [ ] Conversational chat-style search screen (Android `FindLawyersActivity` created as placeholder).

---

## 6. Account Settings — "Delete Account" relocation
**Status: COMPLETED (Android)**
- [x] Relocated from main profile menu to bottom of "Edit Profile" settings.

---

## Next Steps
This section lists tasks to be implemented once the corresponding API functionality is completed in the backend project.

1. **Wiring Clients Module:** Connect the Client List/Detail screens to `/web/api/v1/tasker/clients/:tasker_id`.
2. **Wiring Cases Module:** Connect Case List/Detail and document uploads to `/web/api/v1/tasker/cases/:tasker_id`.
3. **Calendar Integration:** Implement the agenda view using `/web/api/v1/tasker/appointments/:tasker_id`.
4. **AI Search Realization:** Replace simulated matching in `FindLawyersActivity` with the `agent_api/` service once ready.
