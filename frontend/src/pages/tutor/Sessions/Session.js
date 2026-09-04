import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import styles from "./Session.module.scss";

const Sessions = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSessions(response.data.data);
    } catch (error) {
      console.error("Fetch sessions error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load sessions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "scheduled":
        return styles.scheduled;

      case "in_progress":
        return styles.inProgress;

      case "completed":
        return styles.completed;

      case "ai_reviewed":
        return styles.aiReviewed;

      default:
        return "";
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "-";
    }

    return status
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Sessions</h1>

          <p>
            Schedule and manage your tutoring sessions.
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={() =>
            navigate("/tutor/sessions/create")
          }
        >
          + Schedule Session
        </button>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>All Sessions</h2>

            <p>
              View your scheduled and completed sessions.
            </p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>

            <h3>No sessions yet</h3>

            <p>
              Schedule your first session with a student
              to get started.
            </p>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() =>
                navigate("/tutor/sessions/create")
              }
            >
              Schedule Session
            </button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Topic</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>
                      <div className={styles.studentInfo}>
                        <div className={styles.avatar}>
                          {session.students?.profiles?.full_name
                            ?.charAt(0)
                            ?.toUpperCase() || "S"}
                        </div>

                        <span>
                          {session.students?.profiles
                            ?.full_name || "Unknown Student"}
                        </span>
                      </div>
                    </td>

                    <td>{session.topic}</td>

                    <td>
                      {formatDate(session.scheduled_at)}
                    </td>

                    <td>
                      {formatTime(session.scheduled_at)}
                    </td>

                    <td>
                      <span
                        className={`${styles.status} ${getStatusClass(
                          session.status
                        )}`}
                      >
                        {formatStatus(session.status)}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={styles.viewButton}
                        onClick={() =>
                          navigate(
                            `/tutor/sessions/${session.id}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Sessions;