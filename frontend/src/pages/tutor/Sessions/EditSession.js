import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";
import { updateSessionSchema } from "./session.validation";

import styles from "./EditSession.module.scss";

const EditSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(updateSessionSchema),
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          `/sessions/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sessionData = response.data.data;

        if (
          sessionData.status === "completed" ||
          sessionData.status === "ai_reviewed"
        ) {
          toast.error("Completed sessions cannot be edited.");
          navigate(`/tutor/sessions/${sessionId}`);
          return;
        }

        setSession(sessionData);

        reset({
          scheduledAt: formatDateTimeForInput(
            sessionData.scheduled_at
          ),
          topic: sessionData.topic,
        });
      } catch (error) {
        console.error("Fetch session error:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load session."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, navigate, reset]);

  const formatDateTimeForInput = (dateTime) => {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const onSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/sessions/${sessionId}`,
        {
          scheduledAt: new Date(
            formData.scheduledAt
          ),
          topic: formData.topic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Session updated successfully.");

      navigate(`/tutor/sessions/${sessionId}`);
    } catch (error) {
      console.error("Update session error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update session."
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={styles.page}>
        <p>Session not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Edit Session</h1>
          <p>Update the session date, time, or topic.</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.studentInfo}>
          <h3>Student</h3>

          <p>
            {session.students?.profiles?.full_name ||
              "Unknown student"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
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
              <p className={styles.error}>
                {errors.scheduledAt.message}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="topic">Topic</label>

            <input
              id="topic"
              type="text"
              placeholder="Enter session topic"
              {...register("topic")}
            />

            {errors.topic && (
              <p className={styles.error}>
                {errors.topic.message}
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() =>
                navigate(`/tutor/sessions/${sessionId}`)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSession;