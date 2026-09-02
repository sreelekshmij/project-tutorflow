const Joi = require("joi");

const createProgressSchema = Joi.object({
  studentId: Joi.string().uuid().required().messages({
    "string.guid": "Student ID must be a valid UUID",
    "any.required": "Student ID is required",
  }),

  sessionId: Joi.string().uuid().allow(null, "").messages({
    "string.guid": "Session ID must be a valid UUID",
  }),

  topic: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Topic is required",
    "string.min": "Topic must be at least 2 characters",
    "string.max": "Topic cannot exceed 200 characters",
    "any.required": "Topic is required",
  }),

  score: Joi.number().min(0).max(100).allow(null).messages({
    "number.min": "Score cannot be less than 0",
    "number.max": "Score cannot exceed 100",
    "number.base": "Score must be a number",
  }),

  notes: Joi.string().trim().max(2000).allow("", null).messages({
    "string.max": "Progress notes cannot exceed 2000 characters",
  }),
});

module.exports = {
  createProgressSchema,
};