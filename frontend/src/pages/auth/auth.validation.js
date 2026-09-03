import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required"),
});

export const signupSchema = yup.object({
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
});