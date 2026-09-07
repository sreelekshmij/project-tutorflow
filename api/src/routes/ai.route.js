const express = require("express");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth");

const {
  generateSessionPlan,
  generateSessionDebrief,
  generateProgressSummary
} = require("../controllers/ai.controller");

const router = express.Router();

router.post(
  "/sessions/:sessionId/plan",
  authenticate,
  authorize("tutor"),
  generateSessionPlan
);

router.post(
  "/sessions/:sessionId/debrief",
  authenticate,
  authorize("tutor"),
  generateSessionDebrief
);

router.post(
  "/students/:studentId/progress-summary",
  authenticate,
  authorize("tutor"),
  generateProgressSummary
);

module.exports = router;