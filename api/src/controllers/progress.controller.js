const progressService = require("../services/progress.service");

const createProgress = async (req, res) => {
  try {
    const {
      studentId,
      sessionId,
      topic,
      score,
      notes,
    } = req.body;

    const progress = await progressService.createProgress({
      studentId,
      sessionId,
      topic,
      score,
      notes,
      tutorId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Progress record created successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Create progress error:", error.message);

    let statusCode = 500;

    if (
      error.message === "Student not found" ||
      error.message === "Session not found" ||
      error.message === "Session does not belong to this student"
    ) {
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;

    const progress = await progressService.getStudentProgress(
      studentId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Get student progress error:", error.message);

    const statusCode =
      error.message === "Student not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProgress,
  getStudentProgress,
};