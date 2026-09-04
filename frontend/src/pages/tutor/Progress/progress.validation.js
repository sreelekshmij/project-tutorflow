import * as yup from "yup";

export const createProgressSchema = yup.object({
  studentId: yup
    .string()
    .required("Please select a student"),

  sessionId: yup
    .string()
    .nullable(),

  topic: yup
    .string()
    .trim()
    .min(2, "Topic must be at least 2 characters")
    .max(200, "Topic cannot exceed 200 characters")
    .required("Topic is required"),

  score: yup
    .number()
    .typeError("Score must be a number")
    .min(0, "Score cannot be less than 0")
    .max(100, "Score cannot exceed 100")
    .nullable(),

  notes: yup
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .nullable(),
});