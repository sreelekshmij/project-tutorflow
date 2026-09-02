const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

const authRoutes = require("./routes/auth.route");

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TutorFlow API is running",
  });
});

app.use("/api/auth", authRoutes);

module.exports = app;