import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { signupSchema } from "../../../validations/auth.validation";

import styles from "./SignUp.module.scss";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (formData) => {
    try {
      setApiError("");

      const response = await api.post("/auth/signup", {
        ...formData,
        role: "tutor",
      });

      const { user, token } = response.data.data;

      login(user, token);

      navigate("/tutor/dashboard");
    } catch (error) {
      console.error("Signup error:", error);

      setApiError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <h1>TutorFlow</h1>

          <h2>Create your tutor account</h2>

          <p>
            Start managing your students and sessions with TutorFlow.
          </p>
        </div>

        {apiError && (
          <div className={styles.signupError}>
            {apiError}
          </div>
        )}

        <form
          className={styles.signupForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>

            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
            />

            {errors.fullName && (
              <p className={styles.fieldError}>
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />

            {errors.email && (
              <p className={styles.fieldError}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password")}
            />

            {errors.password && (
              <p className={styles.fieldError}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={styles.signupButton}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Account..."
              : "Create Tutor Account"}
          </button>
        </form>

        <div className={styles.loginLink}>
          <span>Already have an account?</span>{" "}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;