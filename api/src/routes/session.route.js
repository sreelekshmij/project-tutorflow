const express = require("express");

const sessionController = require("../controllers/session.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth");

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
  authorize("tutor"),
  validate(createSessionSchema),
  sessionController.createSession
);

router.get(
  "/",
  authenticate,
  authorize("tutor"),
  sessionController.getSessions
);

router.patch(
  "/:sessionId/status",
  authenticate,
  authorize("tutor"),
  validate(updateSessionStatusSchema),
  sessionController.updateSessionStatus
);

router.patch(
  "/:sessionId/notes",
  authenticate,
  authorize("tutor"),
  validate(updateSessionNotesSchema),
  sessionController.updateSessionNotes
);

router.get(
  "/:sessionId",
  authenticate,
  authorize("tutor"),
  sessionController.getSessionById
);

router.patch(
  "/:sessionId",
  authenticate,
  authorize("tutor"),
  validate(updateSessionSchema),
  sessionController.updateSession
);

module.exports = router;