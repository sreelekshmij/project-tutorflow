const studentPortalService = require("../services/student-portal.service");

const getUpcomingSessions = async (req, res) => {
  try {
    const sessions =
      await studentPortalService.getUpcomingSessions(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error(
      "Get upcoming sessions error:",
      error.message
    );

    const statusCode =
      error.message === "Student profile not found"
        ? 404
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompletedSessions = async (req, res) => {
  try {
    const sessions =
      await studentPortalService.getCompletedSessions(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error(
      "Get completed sessions error:",
      error.message
    );

    const statusCode =
      error.message === "Student profile not found"
        ? 404
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getHomework = async (req, res) => {
  try {
    const homework =
      await studentPortalService.getHomework(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: homework,
    });
  } catch (error) {
    console.error("Get homework error:", error.message);

    const statusCode =
      error.message === "Student profile not found"
        ? 404
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getUpcomingSessions,
  getCompletedSessions,
  getHomework,
};