const authService = require("../services/auth.service");

const signup = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const result = await authService.signup({
      fullName,
      email,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    // console.error("Signup error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    // console.error("Login error:", error.message);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};