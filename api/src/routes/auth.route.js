const express = require("express");

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const {
  signupSchema,
  loginSchema,
} = require("../validations/auth.validation");

const router = express.Router();

router.post(
  "/signup",
  validate(signupSchema),
  authController.signup
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

module.exports = router;