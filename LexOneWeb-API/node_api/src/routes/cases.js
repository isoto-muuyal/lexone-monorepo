const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const caseController = require("../controllers/web/caseController");
const upload = require("../middlewares/upload");

router.use(authMiddleware.commonJwt);

router.get("/tasker/cases/:tasker_id", caseController.listCases);
router.get("/tasker/cases/:tasker_id/:case_id", caseController.getCase);
router.get("/tasker/cases/:case_id/documents", caseController.listDocuments);
router.post("/tasker/cases/:case_id/documents", upload.single("file"), caseController.uploadDocument);

module.exports = router;
