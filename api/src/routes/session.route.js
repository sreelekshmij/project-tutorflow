const express = require("express");

const sessionController = require("../controllers/session.controller");
const authenticate = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const {
    createSessionSchema,
    updateSessionSchema,
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