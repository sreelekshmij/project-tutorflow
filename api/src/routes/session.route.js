const express = require("express");

const sessionController = require("../controllers/session.controller");
const authenticate = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const {
  createSessionSchema,
  updateSessionSchema,
  updateSessionStatusSchema,
  updateSessionNotesSchema,
} = require("../validations/session.validation");

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(createSessionSchema),
  sessionController.createSession
);

router.get(
  "/",
  authenticate,
  sessionController.getSessions
);

router.patch(
  "/:sessionId/status",
  authenticate,
  validate(updateSessionStatusSchema),
  sessionController.updateSessionStatus
);

router.patch(
  "/:sessionId/notes",
  authenticate,
  validate(updateSessionNotesSchema),
  sessionController.updateSessionNotes
);

router.get(
  "/:sessionId",
  authenticate,
  sessionController.getSessionById
);

router.patch(
  "/:sessionId",
  authenticate,
  validate(updateSessionSchema),
  sessionController.updateSession
);

module.exports = router;