const express = require("express");

const studentPortalController = require("../controllers/student-portal.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/sessions/upcoming",
  authenticate,
  authorize("student"),
  studentPortalController.getUpcomingSessions
);

router.get(
  "/sessions/completed",
  authenticate,
  authorize("student"),
  studentPortalController.getCompletedSessions
);

router.get(
  "/homework",
  authenticate,
  authorize("student"),
  studentPortalController.getHomework
);

module.exports = router;