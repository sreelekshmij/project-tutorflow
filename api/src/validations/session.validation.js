const Joi = require("joi");

const createSessionSchema = Joi.object({
  studentId: Joi.string().uuid().required().messages({
    "string.guid": "Student ID must be a valid UUID",
    "string.empty": "Student ID is required",
    "any.required": "Student ID is required",
  }),

  scheduledAt: Joi.date().required().messages({
    "date.format": "Scheduled time must be a valid ISO date",
    "date.base": "Scheduled time must be a valid date",
    "any.required": "Scheduled time is required",
  }),

  topic: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Topic is required",
    "string.min": "Topic must be at least 2 characters",
    "string.max": "Topic cannot exceed 200 characters",
    "any.required": "Topic is required",
  }),
});

const updateSessionSchema = Joi.object({
  scheduledAt: Joi.date().messages({
    "date.format": "Scheduled time must be a valid ISO date",
    "date.base": "Scheduled time must be a valid date",
  }),

  topic: Joi.string().trim().min(2).max(200).messages({
    "string.min": "Topic must be at least 2 characters",
    "string.max": "Topic cannot exceed 200 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });

const updateSessionStatusSchema = Joi.object({
  status: Joi.string()
    .valid("in_progress", "completed", "ai_reviewed")
    .required()
    .messages({
      "any.only":
        "Status must be in_progress, completed, or ai_reviewed",
      "any.required": "Status is required",
    }),
});

const updateSessionNotesSchema = Joi.object({
  notes: Joi.string()
    .max(10000)
    .allow("")
    .required()
    .messages({
      "string.max": "Notes cannot exceed 10000 characters",
      "any.required": "Notes are required",
    }),
});

module.exports = {
  createSessionSchema,
  updateSessionSchema,
  updateSessionStatusSchema,
  updateSessionNotesSchema,
};