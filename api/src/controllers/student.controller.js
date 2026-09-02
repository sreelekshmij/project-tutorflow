const studentService = require("../services/student.service");

const createStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      subject,
      currentLevel,
      learningGoals,
      weakAreas,
    } = req.body;

    const student = await studentService.createStudent({
      fullName,
      email,
      password,
      subject,
      currentLevel,
      learningGoals,
      weakAreas,
      tutorId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Create student error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await studentService.getStudents(req.user.id);

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get students error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await studentService.getStudentById(
      studentId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get student error:", error.message);

    const statusCode =
      error.message === "Student not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await studentService.updateStudent(
      studentId,
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Update student error:", error.message);

    const statusCode =
      error.message === "Student not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await studentService.deleteStudent(
      studentId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete student error:", error.message);

    const statusCode =
      error.message === "Student not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};