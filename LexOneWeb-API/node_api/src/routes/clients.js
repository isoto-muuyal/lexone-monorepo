const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const clientController = require("../controllers/web/clientController");

router.use(authMiddleware.commonJwt);

router.get("/tasker/clients/:tasker_id", clientController.listClients);
router.get("/tasker/clients/:tasker_id/:client_id", clientController.getClient);
router.put("/tasker/clients/:client_id/notes", clientController.updateClientNotes);

module.exports = router;
