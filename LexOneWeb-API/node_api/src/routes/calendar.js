const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const calendarController = require("../controllers/web/calendarController");

router.post("/payments/webhook", calendarController.paymentWebhook);

router.use(authMiddleware.commonJwt);

router.get("/tasker/:tasker_id/availability", calendarController.getAvailability);
router.put("/tasker/:tasker_id/availability", calendarController.updateAvailability);

router.get("/tasker/:tasker_id/calendar-blocks", calendarController.listCalendarBlocks);
router.post("/tasker/:tasker_id/calendar-blocks", calendarController.createCalendarBlock);
router.delete("/tasker/:tasker_id/calendar-blocks/:block_id", calendarController.deleteCalendarBlock);

router.get("/lawyers/:tasker_id/available-slots", calendarController.availableSlots);

router.get("/tasker/appointments/:tasker_id", calendarController.listAppointments);
router.post("/lawyers/:tasker_id/appointments", calendarController.createAppointment);
router.put("/tasker/appointments/:appointment_id", calendarController.updateAppointment);
router.put("/tasker/appointments/:appointment_id/cancel", calendarController.cancelAppointment);
router.put("/tasker/appointments/:appointment_id/mark-paid", calendarController.markAppointmentPaid);

router.get("/tasker/:tasker_id/revenue", calendarController.revenue);

module.exports = router;
