const Joi = require("joi");

const createStudentSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name cannot exceed 100 characters",
    "any.required": "Full name is required",
  }),

  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password cannot exceed 100 characters",
    "any.required": "Password is required",
  }),

  subject: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Subject is required",
    "string.min": "Subject must be at least 2 characters",
    "string.max": "Subject cannot exceed 100 characters",
    "any.required": "Subject is required",
  }),

  currentLevel: Joi.string().trim().max(100).allow("", null).messages({
    "string.max": "Current level cannot exceed 100 characters",
  }),

  learningGoals: Joi.string().trim().max(1000).allow("", null).messages({
    "string.max": "Learning goals cannot exceed 1000 characters",
  }),

  weakAreas: Joi.string().trim().max(1000).allow("", null).messages({
    "string.max": "Weak areas cannot exceed 1000 characters",
  }),
});

const updateStudentSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name cannot exceed 100 characters",
  }),

  subject: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Subject must be at least 2 characters",
    "string.max": "Subject cannot exceed 100 characters",
  }),

  currentLevel: Joi.string().trim().max(100).allow("", null).messages({
    "string.max": "Current level cannot exceed 100 characters",
  }),

  learningGoals: Joi.string().trim().max(1000).allow("", null).messages({
    "string.max": "Learning goals cannot exceed 1000 characters",
  }),

  weakAreas: Joi.string().trim().max(1000).allow("", null).messages({
    "string.max": "Weak areas cannot exceed 1000 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });

module.exports = {
  createStudentSchema,
  updateStudentSchema,
};