import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { loginSchema } from "../auth.validation";

import styles from "./Login.module.scss";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    try {
      const response = await api.post("/auth/login", formData);

      const { user, token } = response.data.data;

      login(user, token);
      toast.success("Login successful!");

      if (user.role === "tutor") {
        navigate("/tutor/dashboard");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
        "Unable to login. Please try again."
      );
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>TutorFlow</h1>

          <p>
            Welcome back! Please login to continue.
          </p>
        </div>

        <form
          className={styles.loginForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.formGroup}>
            <label htmlFor="email">
              Email
            </label>

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
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
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
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className={styles.signupLink}>
          <span>Don't have an account?</span>{" "}
          <Link to="/signup">Sign up as a tutor</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;