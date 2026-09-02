const express = require("express");

const progressController = require("../controllers/progress.controller");
const authenticate = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const {
  createProgressSchema,
} = require("../validations/progress.validation");

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(createProgressSchema),
  progressController.createProgress
);

router.get(
  "/student/:studentId",
  authenticate,
  progressController.getStudentProgress
);

module.exports = router;