const sessionService = require("../services/session.service");

const createSession = async (req, res) => {
  try {
    const {
      studentId,
      scheduledAt,
      topic,
    } = req.body;

    console.log(req.body);

    const session = await sessionService.createSession({
      studentId,
      scheduledAt,
      topic,
      tutorId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });
  } catch (error) {
    console.error("Create session error:", error.message);

    const statusCode =
      error.message === "Student not found" ||
      error.message ===
        "Tutor already has a session scheduled at this time"
        ? 400
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getSessions(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await sessionService.getSessionById(
      sessionId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Get session error:", error.message);

    const statusCode =
      error.message === "Session not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await sessionService.updateSession(
      sessionId,
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: session,
    });
  } catch (error) {
    console.error("Update session error:", error.message);

    let statusCode = 500;

    if (error.message === "Session not found") {
      statusCode = 404;
    } else if (
      error.message === "Completed sessions cannot be edited" ||
      error.message ===
        "Tutor already has a session scheduled at this time"
    ) {
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    const session = await sessionService.updateSessionStatus(
      sessionId,
      req.user.id,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Session status updated successfully",
      data: session,
    });
  } catch (error) {
    console.error("Update session status error:", error.message);

    let statusCode = 500;

    if (error.message === "Session not found") {
      statusCode = 404;
    } else if (
      error.message.startsWith("Invalid status transition")
    ) {
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSessionNotes = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { notes } = req.body;

    const session = await sessionService.updateSessionNotes(
      sessionId,
      req.user.id,
      notes
    );

    return res.status(200).json({
      success: true,
      message: "Session notes updated successfully",
      data: session,
    });
  } catch (error) {
    console.error("Update session notes error:", error.message);

    let statusCode = 500;

    if (error.message === "Session not found") {
      statusCode = 404;
    } else if (
      error.message ===
      "Notes can only be updated while the session is in progress"
    ) {
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  updateSessionStatus,
  updateSessionNotes,
};