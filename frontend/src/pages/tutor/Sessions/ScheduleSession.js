import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import { createSessionSchema } from "./session.validation";

import styles from "./ScheduleSession.module.scss";

const ScheduleSession = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedStudentId = searchParams.get("studentId");

  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] =
    useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createSessionSchema),
    defaultValues: {
      studentId: selectedStudentId || "",
      scheduledAt: "",
      topic: "",
    },
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoadingStudents(true);

        const token = localStorage.getItem("token");

        const response = await api.get("/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudents(response.data.data);
      } catch (error) {
        console.error("Fetch students error:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load students."
        );
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");

      await api.post("/sessions", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Session scheduled successfully!");

      navigate("/tutor/sessions");
    } catch (error) {
      console.error("Schedule session error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to schedule session."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStudents) {
    return (
      <div className={styles.loadingState}>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/tutor/sessions")}
          >
            ← Back to Sessions
          </button>

          <h1>Schedule Session</h1>

          <p>
            Schedule a tutoring session with one of your
            students.
          </p>
        </div>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Session Details</h2>

            <p>
              Choose the student, date, time and topic for
              this session.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="studentId">
              Student
            </label>

            <select
              id="studentId"
              {...register("studentId")}
            >
              <option value="">
                Select a student
              </option>

              {students.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.profiles?.full_name ||
                    "Unknown Student"}
                </option>
              ))}
            </select>

            {errors.studentId && (
              <span className={styles.error}>
                {errors.studentId.message}
              </span>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="scheduledAt">
                Date & Time
              </label>

              <input
                id="scheduledAt"
                type="datetime-local"
                {...register("scheduledAt")}
              />

              {errors.scheduledAt && (
                <span className={styles.error}>
                  {errors.scheduledAt.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="topic">
                Topic
              </label>

              <input
                id="topic"
                type="text"
                placeholder="e.g. Algebra Basics"
                {...register("topic")}
              />

              {errors.topic && (
                <span className={styles.error}>
                  {errors.topic.message}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate("/tutor/sessions")}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSubmitting || students.length === 0}
          >
            {isSubmitting
              ? "Scheduling..."
              : "Schedule Session"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleSession;