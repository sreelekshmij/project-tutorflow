const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/check", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

module.exports = app;