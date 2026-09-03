import * as yup from "yup";

export const createSessionSchema = yup.object({
  studentId: yup
    .string()
    .required("Please select a student"),

  scheduledAt: yup
    .string()
    .required("Date and time are required"),

  topic: yup
    .string()
    .trim()
    .min(2, "Topic must be at least 2 characters")
    .max(200, "Topic cannot exceed 200 characters")
    .required("Topic is required"),
});