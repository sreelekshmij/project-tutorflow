const express = require("express");

const studentController = require("../controllers/student.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth");

const validate = require("../middlewares/validate");

const {
  createStudentSchema,
  updateStudentSchema,
} = require("../validations/student.validation");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("tutor"),
  validate(createStudentSchema),
  studentController.createStudent
);

router.get(
  "/",
  authenticate,
  authorize("tutor"),
  studentController.getStudents
);

router.get(
  "/:studentId",
  authenticate,
  authorize("tutor"),
  studentController.getStudentById
);

router.patch(
  "/:studentId",
  authenticate,
  authorize("tutor"),
  validate(updateStudentSchema),
  studentController.updateStudent
);

router.delete(
  "/:studentId",
  authenticate,
  authorize("tutor"),
  studentController.deleteStudent
);

module.exports = router;