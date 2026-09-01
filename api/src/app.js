const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const supabase = require("./config/supabase");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TutorFlow API is running",
  });
});

module.exports = app;