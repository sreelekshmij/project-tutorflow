const express = require("express");

const studentPortalController = require("../controllers/student-portal.controller");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/sessions/upcoming",
  authenticate,
  studentPortalController.getUpcomingSessions
);

router.get(
  "/sessions/completed",
  authenticate,
  studentPortalController.getCompletedSessions
);

router.get(
  "/homework",
  authenticate,
  studentPortalController.getHomework
);

module.exports = router;