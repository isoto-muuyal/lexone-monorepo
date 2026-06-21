# LexOne API Backlog — Lawyer Dashboard Features

Generated from mock data implemented in `web_src/src/utils/mockAuth.js`.
Each section documents the endpoint contract and the Mongoose query needed in `node_api/`.

---

## 1. Clients

### GET /web/api/v1/tasker/clients/:tasker_id
List all clients for a lawyer.

**Response:**
```json
{
  "status_code": 200,
  "clients": [
    {
      "client_id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "case_ids": ["string"]
    }
  ]
}
```

**Mongoose query (node_api):**
```js
// models/Client.js — new model
const ClientSchema = new mongoose.Schema({
  tasker_id:  { type: String, required: true, index: true },
  name:       String,
  email:      String,
  phone:      String,
  address:    String,
  case_ids:   [String],
  created_at: { type: Date, default: Date.now },
});

// controller
const clients = await Client.find({ tasker_id: req.params.tasker_id })
  .select('client_id name email phone address case_ids');
```

---

### GET /web/api/v1/tasker/clients/:tasker_id/:client_id
Get a single client's full detail.

**Response:** same shape as individual client object above.

**Mongoose query:**
```js
const client = await Client.findOne({
  _id: req.params.client_id,
  tasker_id: req.params.tasker_id,
});
```

---

### PUT /web/api/v1/tasker/clients/:client_id/notes
Save lawyer's private notes for a client. Notes are lawyer-private (never visible to client).

**Request body:** `{ tasker_id, notes }`

**Response:** `{ "status_code": 200 }`

**Mongoose query:**
```js
// Add notes field to Client model: notes: { type: String, default: '' }
await Client.updateOne(
  { _id: req.params.client_id, tasker_id: req.body.tasker_id },
  { $set: { notes: req.body.notes } }
);
```

**Frontend switch:** In [ClientDetail.js](web_src/src/Pages/Tasker/Clients/ClientDetail.js) `save_notes()`, replace `localStorage.setItem(...)` with:
```js
axios.put(`${BASE}/web/api/v1/tasker/clients/${client.client_id}/notes`, { tasker_id, notes });
```

---

## 2. Cases

### GET /web/api/v1/tasker/cases/:tasker_id
List all cases for a lawyer.

**Response:**
```json
{
  "status_code": 200,
  "cases": [
    {
      "case_id": "string",
      "reference_id": "string",
      "client_id": "string",
      "client_name": "string",
      "description": "string",
      "status": "started | accepted | completed | pending",
      "created_date": "YYYY-MM-DD",
      "documents": []
    }
  ]
}
```

**Mongoose query:**
```js
// models/Case.js — new model (extends existing booking/need concept)
const CaseSchema = new mongoose.Schema({
  tasker_id:    { type: String, required: true, index: true },
  client_id:    String,
  client_name:  String,
  reference_id: String,
  description:  String,
  status:       { type: String, enum: ['started', 'accepted', 'completed', 'pending'] },
  created_date: { type: Date, default: Date.now },
  documents:    [DocumentSchema],
});

const cases = await Case.find({ tasker_id: req.params.tasker_id })
  .select('-__v')
  .sort({ created_date: -1 });
```

---

### GET /web/api/v1/tasker/cases/:tasker_id/:case_id
Get single case with all documents.

**Mongoose query:**
```js
const cas = await Case.findOne({
  _id: req.params.case_id,
  tasker_id: req.params.tasker_id,
});
```

---

## 3. Documents

### GET /web/api/v1/tasker/cases/:case_id/documents
Get all document versions for a case.

**Response:**
```json
{
  "status_code": 200,
  "documents": [
    {
      "doc_id": "string",
      "type": "string",
      "version": 1,
      "file_name": "string",
      "file_url": "string",
      "date": "YYYY-MM-DD"
    }
  ]
}
```

**Mongoose sub-document schema:**
```js
const DocumentSchema = new mongoose.Schema({
  type:      String,
  version:   Number,
  file_name: String,
  file_url:  String,        // S3 / storage URL
  date:      { type: Date, default: Date.now },
});
```

---

### POST /web/api/v1/tasker/cases/:case_id/documents
Upload a new document version. Existing versions of the same type are NOT replaced — a new entry is appended.

**Request:** `multipart/form-data` — fields: `tasker_id`, `doc_type`, `file`

**Response:**
```json
{
  "status_code": 200,
  "document": { "doc_id": "...", "version": 2, "file_url": "..." }
}
```

**Node.js controller logic:**
```js
// 1. Determine next version for this doc_type in this case
const cas = await Case.findById(req.params.case_id);
const same_type = cas.documents.filter(d => d.type === req.body.doc_type);
const next_version = same_type.length > 0
  ? Math.max(...same_type.map(d => d.version)) + 1
  : 1;

// 2. Upload file to S3 (or local storage)
const file_url = await uploadToS3(req.file, `cases/${cas._id}/${next_version}_${req.file.originalname}`);

// 3. Push new document entry
await Case.updateOne(
  { _id: req.params.case_id },
  { $push: { documents: { type: req.body.doc_type, version: next_version, file_name: req.file.originalname, file_url, date: new Date() } } }
);
```

**Frontend switch:** In [CaseDetail.js](web_src/src/Pages/Tasker/Cases/CaseDetail.js) `confirm_upload()`, replace localStorage logic with:
```js
const form = new FormData();
form.append('tasker_id', user_id);
form.append('doc_type', upload_type);
form.append('file', this.file_input_ref.current.files[0]);
const res = await axios.post(`${BASE}/web/api/v1/tasker/cases/${cas.case_id}/documents`, form);
this.setState({ documents: [...documents, res.data.document] });
```

---

## 4. Calendar / Availability / Appointments / Payments

### Agent implementation prompt

Build the calendar backend as an additive `node_api` feature. Do not modify existing controllers/routes/models unless route registration requires adding a new route file to the existing router tree. Lawyers must be able to define recurring availability at day/hour level, block specific hours for personal reasons or existing appointments, and let clients see available slots before scheduling. Appointments must support online payment or cash/manual payment, and paid appointments must feed the lawyer revenue chart.

Core behavior:

- A lawyer can define weekly availability windows per day, with timezone and appointment duration settings.
- A lawyer can block one-off date/time windows for personal reasons, vacations, conflicts, or admin holds.
- Confirmed appointments automatically block their time range from public availability.
- A client can request availability for a lawyer and see only bookable slots after applying weekly rules, manual blocks, existing appointments, lead time, and date range.
- A client can schedule an appointment from an available slot.
- Payment can be `online` or `cash`.
- Online payment creates a payment intent/session and marks the appointment `paid` only after provider confirmation/webhook.
- Cash/manual payment starts as `pending` or `unpaid`; the lawyer can mark it `paid`.
- Revenue chart queries must count only paid appointments/transactions and must support date ranges.

Suggested files:

- `node_api/models/LawyerAvailability.js`
- `node_api/models/CalendarBlock.js`
- `node_api/models/Appointment.js`
- `node_api/models/PaymentTransaction.js`
- `node_api/controllers/calendarController.js`
- `node_api/routes/calendar.js` registered under `/web/api/v1`

Use the existing auth middleware pattern. Lawyer-owned endpoints require the authenticated lawyer/tasker to match `:tasker_id` or body `tasker_id`. Client scheduling endpoints require an authenticated client/user where available; keep fields compatible with current mock auth while real auth is finalized.

### Schema definitions

```js
// models/LawyerAvailability.js
const AvailabilityWindowSchema = new mongoose.Schema({
  day_of_week: { type: Number, required: true, min: 0, max: 6 }, // 0 Sunday ... 6 Saturday
  start_time:  { type: String, required: true }, // "HH:MM", lawyer timezone
  end_time:    { type: String, required: true }, // "HH:MM", exclusive
  enabled:     { type: Boolean, default: true },
});

const LawyerAvailabilitySchema = new mongoose.Schema({
  tasker_id:              { type: String, required: true, unique: true, index: true },
  timezone:               { type: String, required: true, default: 'America/New_York' },
  slot_duration_minutes:  { type: Number, default: 60, min: 15 },
  buffer_minutes:         { type: Number, default: 0, min: 0 },
  min_notice_minutes:     { type: Number, default: 120, min: 0 },
  booking_window_days:    { type: Number, default: 60, min: 1 },
  weekly_windows:         [AvailabilityWindowSchema],
  created_at:             { type: Date, default: Date.now },
  updated_at:             { type: Date, default: Date.now },
});
```

```js
// models/CalendarBlock.js
const CalendarBlockSchema = new mongoose.Schema({
  tasker_id:    { type: String, required: true, index: true },
  start_at:     { type: Date, required: true, index: true },
  end_at:       { type: Date, required: true, index: true },
  reason:       { type: String, default: '' },
  source:       { type: String, enum: ['manual', 'appointment', 'system'], default: 'manual' },
  appointment_id: { type: String, default: null },
  created_by:   { type: String, default: null },
  created_at:   { type: Date, default: Date.now },
});
CalendarBlockSchema.index({ tasker_id: 1, start_at: 1, end_at: 1 });
```

```js
// models/Appointment.js
const AppointmentSchema = new mongoose.Schema({
  tasker_id:        { type: String, required: true, index: true },
  client_id:        { type: String, default: null, index: true },
  client_name:      String,
  client_email:     String,
  client_phone:     String,
  case_id:          { type: String, default: null },
  reference_id:     { type: String, default: null },
  title:            String,
  start_at:         { type: Date, required: true, index: true },
  end_at:           { type: Date, required: true, index: true },
  timezone:         { type: String, required: true },
  type:             { type: String, enum: ['online', 'in-person'], required: true },
  link:             { type: String, default: null },
  location:         { type: String, default: null },
  notes:            { type: String, default: '' },
  status:           { type: String, enum: ['scheduled', 'completed', 'cancelled', 'no_show'], default: 'scheduled', index: true },
  payment_method:   { type: String, enum: ['online', 'cash'], required: true },
  payment_status:   { type: String, enum: ['unpaid', 'pending', 'paid', 'failed', 'refunded'], default: 'unpaid', index: true },
  price_amount:     { type: Number, required: true, min: 0 }, // integer cents
  currency:         { type: String, default: 'USD' },
  paid_at:          { type: Date, default: null },
  created_at:       { type: Date, default: Date.now },
  updated_at:       { type: Date, default: Date.now },
});
AppointmentSchema.index({ tasker_id: 1, start_at: 1, end_at: 1 });
```

```js
// models/PaymentTransaction.js
const PaymentTransactionSchema = new mongoose.Schema({
  appointment_id:      { type: String, required: true, index: true },
  tasker_id:           { type: String, required: true, index: true },
  client_id:           { type: String, default: null, index: true },
  method:              { type: String, enum: ['online', 'cash'], required: true },
  status:              { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], required: true, index: true },
  amount:              { type: Number, required: true, min: 0 }, // integer cents
  currency:            { type: String, default: 'USD' },
  provider:            { type: String, enum: ['stripe', 'manual'], required: true },
  provider_payment_id: { type: String, default: null, index: true },
  marked_paid_by:      { type: String, default: null },
  paid_at:             { type: Date, default: null, index: true },
  created_at:          { type: Date, default: Date.now },
  updated_at:          { type: Date, default: Date.now },
});
```

### Lawyer availability endpoints

### GET /web/api/v1/tasker/:tasker_id/availability
Return the lawyer's weekly availability configuration.

**Response:**
```json
{
  "status_code": 200,
  "availability": {
    "tasker_id": "string",
    "timezone": "America/New_York",
    "slot_duration_minutes": 60,
    "buffer_minutes": 0,
    "min_notice_minutes": 120,
    "booking_window_days": 60,
    "weekly_windows": [
      { "day_of_week": 1, "start_time": "09:00", "end_time": "17:00", "enabled": true }
    ]
  }
}
```

### PUT /web/api/v1/tasker/:tasker_id/availability
Create or replace the lawyer's weekly availability configuration.

**Request body:** same `availability` object fields except `tasker_id`.

**Mongoose:**
```js
const availability = await LawyerAvailability.findOneAndUpdate(
  { tasker_id: req.params.tasker_id },
  { $set: { ...req.body, tasker_id: req.params.tasker_id, updated_at: new Date() } },
  { new: true, upsert: true, setDefaultsOnInsert: true }
);
```

### Calendar block endpoints

### GET /web/api/v1/tasker/:tasker_id/calendar-blocks?from=ISO_DATE&to=ISO_DATE
List manual/system blocks for the lawyer in a date range.

### POST /web/api/v1/tasker/:tasker_id/calendar-blocks
Create a block for personal reasons or admin holds.

**Request body:**
```json
{
  "start_at": "2026-07-01T13:00:00.000Z",
  "end_at": "2026-07-01T15:00:00.000Z",
  "reason": "Personal appointment"
}
```

### DELETE /web/api/v1/tasker/:tasker_id/calendar-blocks/:block_id
Delete only manual blocks. Do not delete appointment-sourced blocks directly; cancel or move the appointment instead.

### Client availability endpoint

### GET /web/api/v1/lawyers/:tasker_id/available-slots?from=YYYY-MM-DD&to=YYYY-MM-DD&type=online
Return public bookable slots for a lawyer.

Availability generation logic:

1. Load `LawyerAvailability` for `tasker_id`.
2. Generate candidate slots from enabled `weekly_windows` in the lawyer timezone using `slot_duration_minutes` and `buffer_minutes`.
3. Exclude slots before `now + min_notice_minutes`.
4. Exclude slots beyond `booking_window_days`.
5. Load `CalendarBlock` rows overlapping the requested range.
6. Load active `Appointment` rows where `status` is not `cancelled` and ranges overlap.
7. Return only candidates that do not overlap either blocks or active appointments.

**Response:**
```json
{
  "status_code": 200,
  "timezone": "America/New_York",
  "slot_duration_minutes": 60,
  "slots": [
    {
      "start_at": "2026-07-06T14:00:00.000Z",
      "end_at": "2026-07-06T15:00:00.000Z",
      "local_date": "2026-07-06",
      "local_start_time": "10:00",
      "local_end_time": "11:00"
    }
  ]
}
```

### Appointment endpoints

### GET /web/api/v1/tasker/appointments/:tasker_id
List all appointments for a lawyer, sorted by `start_at` ascending. Support optional `from`, `to`, `status`, and `payment_status` query params.

**Response:**
```json
{
  "status_code": 200,
  "appointments": [
    {
      "appointment_id": "string",
      "title": "string",
      "client_id": "string | null",
      "client_name": "string",
      "case_id": "string | null",
      "reference_id": "string | null",
      "start_at": "2026-07-06T14:00:00.000Z",
      "end_at": "2026-07-06T15:00:00.000Z",
      "timezone": "America/New_York",
      "type": "online | in-person",
      "link": "string | null",
      "location": "string | null",
      "notes": "string",
      "status": "scheduled | completed | cancelled | no_show",
      "payment_method": "online | cash",
      "payment_status": "unpaid | pending | paid | failed | refunded",
      "price_amount": 15000,
      "currency": "USD",
      "paid_at": "2026-07-06T13:50:00.000Z | null"
    }
  ]
}
```

**Mongoose query:**
```js
const filter = { tasker_id: req.params.tasker_id };
if (req.query.from || req.query.to) {
  filter.start_at = {};
  if (req.query.from) filter.start_at.$gte = new Date(req.query.from);
  if (req.query.to) filter.start_at.$lte = new Date(req.query.to);
}
if (req.query.status) filter.status = req.query.status;
if (req.query.payment_status) filter.payment_status = req.query.payment_status;

const appointments = await Appointment.find(filter).sort({ start_at: 1 });
```

---

### POST /web/api/v1/lawyers/:tasker_id/appointments
Client schedules a new appointment from an available slot.

Before create, rerun the availability overlap check on `start_at` / `end_at` to prevent double booking. If available, create the appointment and an appointment-sourced `CalendarBlock` in the same logical operation. If the payment method is `online`, also create a pending `PaymentTransaction` and payment provider intent/session.

**Request body:**
```json
{
  "client_id": "string | null",
  "client_name": "string",
  "client_email": "string",
  "client_phone": "string",
  "case_id": "string | null",
  "title": "Consultation",
  "start_at": "2026-07-06T14:00:00.000Z",
  "end_at": "2026-07-06T15:00:00.000Z",
  "type": "online",
  "location": null,
  "notes": "string",
  "payment_method": "online",
  "price_amount": 15000,
  "currency": "USD"
}
```

**Response for online payment:**
```json
{
  "status_code": 200,
  "appointment": { "appointment_id": "string", "payment_status": "pending" },
  "payment": {
    "transaction_id": "string",
    "provider": "stripe",
    "client_secret": "string"
  }
}
```

**Response for cash payment:**
```json
{
  "status_code": 200,
  "appointment": { "appointment_id": "string", "payment_status": "unpaid" },
  "payment": {
    "transaction_id": "string",
    "provider": "manual",
    "status": "pending"
  }
}
```

**Mongoose:**
```js
const overlaps = await hasCalendarOverlap(tasker_id, start_at, end_at);
if (overlaps) return res.status(409).json({ status_code: 409, message: 'Slot is no longer available' });

const appt = await Appointment.create({
  tasker_id,
  ...req.body,
  timezone: availability.timezone,
  payment_status: req.body.payment_method === 'online' ? 'pending' : 'unpaid',
});

await CalendarBlock.create({
  tasker_id,
  start_at: appt.start_at,
  end_at: appt.end_at,
  source: 'appointment',
  appointment_id: appt._id,
  reason: 'Appointment',
});

const tx = await PaymentTransaction.create({
  appointment_id: appt._id,
  tasker_id,
  client_id: appt.client_id,
  method: appt.payment_method,
  status: 'pending',
  amount: appt.price_amount,
  currency: appt.currency,
  provider: appt.payment_method === 'online' ? 'stripe' : 'manual',
});
```

---

### PUT /web/api/v1/tasker/appointments/:appointment_id
Update an existing appointment.

**Mongoose:**
```js
await Appointment.updateOne(
  { _id: req.params.appointment_id, tasker_id: req.body.tasker_id },
  { $set: { ...req.body } }
);
```

---

### PUT /web/api/v1/tasker/appointments/:appointment_id/cancel
Cancel an appointment and remove its appointment-sourced calendar block. Do not hard-delete appointments that may have payment records.

**Mongoose:**
```js
await Appointment.updateOne(
  { _id: req.params.appointment_id, tasker_id: req.body.tasker_id },
  { $set: { status: 'cancelled', updated_at: new Date() } }
);
await CalendarBlock.deleteMany({ appointment_id: req.params.appointment_id, source: 'appointment' });
```

### PUT /web/api/v1/tasker/appointments/:appointment_id/mark-paid
Lawyer marks a cash/manual appointment as paid after receiving cash. This must update both `Appointment` and `PaymentTransaction`, and this paid transaction becomes eligible for the revenue chart.

**Request body:**
```json
{
  "tasker_id": "string",
  "marked_paid_by": "string"
}
```

**Mongoose:**
```js
const paid_at = new Date();
await Appointment.updateOne(
  {
    _id: req.params.appointment_id,
    tasker_id: req.body.tasker_id,
    payment_method: 'cash',
  },
  { $set: { payment_status: 'paid', paid_at, updated_at: paid_at } }
);
await PaymentTransaction.updateOne(
  {
    appointment_id: req.params.appointment_id,
    tasker_id: req.body.tasker_id,
    method: 'cash',
  },
  {
    $set: {
      status: 'paid',
      paid_at,
      marked_paid_by: req.body.marked_paid_by,
      updated_at: paid_at,
    },
  }
);
```

### POST /web/api/v1/payments/webhook
Payment provider webhook. For Stripe, verify the webhook signature before updating local records.

On successful payment:

- Find `PaymentTransaction` by `provider_payment_id`.
- Set transaction `status: 'paid'` and `paid_at`.
- Set appointment `payment_status: 'paid'` and `paid_at`.

### GET /web/api/v1/tasker/:tasker_id/revenue?from=YYYY-MM-DD&to=YYYY-MM-DD&group_by=day|week|month
Return paid revenue totals for charting.

**Mongoose aggregation:**
```js
const match = {
  tasker_id: req.params.tasker_id,
  status: 'paid',
  paid_at: { $gte: new Date(req.query.from), $lte: new Date(req.query.to) },
};

const revenue = await PaymentTransaction.aggregate([
  { $match: match },
  {
    $group: {
      _id: {
        $dateToString: {
          format: req.query.group_by === 'month' ? '%Y-%m' : '%Y-%m-%d',
          date: '$paid_at',
        },
      },
      total_amount: { $sum: '$amount' },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);
```

**Frontend switch:** In [CalendarPage.js](web_src/src/Pages/Tasker/Calendar/CalendarPage.js) `load_appointments()`, remove the mock block and uncomment the axios call.

---

## Implementation Order (suggested)

1. Create `Client`, `Case`, `Appointment`, `LawyerAvailability`, `CalendarBlock`, and `PaymentTransaction` Mongoose models in `node_api/models/`
2. Create `Case.documents` embedded sub-schema with version logic
3. Implement calendar routes in a new `node_api/routes/calendar.js` file and register it under `/web/api/v1`
4. Wire S3 upload for documents (reuse existing S3 config if present, see `.env` `AWS_BUCKET`)
5. Remove mock intercepts from frontend one endpoint at a time after testing each

---

## Notes

- All endpoints require `Authorization` header (existing middleware pattern from other tasker routes).
- `client_id` and `case_id` on appointments are optional (nullable) to support "new client" walk-ins.
- Document upload does NOT replace previous versions — always append with `$push`.
- Private notes (`Client.notes`) should be excluded from any client-facing API responses.
- Store appointment/block times as UTC `Date` values and keep the lawyer timezone on availability/appointments for display and slot generation.
- Never trust client-provided availability. Always recompute overlap server-side before creating or moving appointments.
- Revenue charts must use `PaymentTransaction.status === 'paid'`, not appointment status alone.
