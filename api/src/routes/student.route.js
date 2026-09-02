const express = require("express");

const studentController = require("../controllers/student.controller");
const authenticate = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const {
  createStudentSchema,
  updateStudentSchema,
} = require("../validations/student.validation");

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(createStudentSchema),
  studentController.createStudent
);

router.get(
  "/",
  authenticate,
  studentController.getStudents
);

router.get(
  "/:studentId",
  authenticate,
  studentController.getStudentById
);

router.patch(
  "/:studentId",
  authenticate,
  validate(updateStudentSchema),
  studentController.updateStudent
);

router.delete(
  "/:studentId",
  authenticate,
  studentController.deleteStudent
);

module.exports = router;