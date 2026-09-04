import * as yup from "yup";

export const createStudentSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .required("Full name is required"),

  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  subject: yup
    .string()
    .trim()
    .min(2, "Subject must be at least 2 characters")
    .max(100, "Subject cannot exceed 100 characters")
    .required("Subject is required"),

  currentLevel: yup
    .string()
    .trim()
    .max(100, "Current level cannot exceed 100 characters"),

  learningGoals: yup
    .string()
    .trim()
    .max(1000, "Learning goals cannot exceed 1000 characters"),

  weakAreas: yup
    .string()
    .trim()
    .max(1000, "Weak areas cannot exceed 1000 characters"),
});

export const updateStudentSchema = yup
  .object({
    fullName: yup
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters"),

    subject: yup
      .string()
      .trim()
      .min(2, "Subject must be at least 2 characters")
      .max(100, "Subject cannot exceed 100 characters"),

    currentLevel: yup
      .string()
      .trim()
      .max(100, "Current level cannot exceed 100 characters"),

    learningGoals: yup
      .string()
      .trim()
      .max(1000, "Learning goals cannot exceed 1000 characters"),

    weakAreas: yup
      .string()
      .trim()
      .max(1000, "Weak areas cannot exceed 1000 characters"),
  })
  .test(
    "at-least-one-field",
    "At least one field is required for update",
    (value) =>
      value &&
      Object.values(value).some(
        (field) => field !== undefined && field.trim() !== ""
      )
  );