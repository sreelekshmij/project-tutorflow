import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import styles from "./CompletedSessions.module.scss";

const CompletedSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedSessions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(
        "/student-portal/sessions/completed",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessions(response.data.data || []);
    } catch (error) {
      console.error("Fetch completed sessions error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load completed sessions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedSessions();
  }, []);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Completed Sessions</h1>
          <p>Review your previous learning sessions and notes.</p>
        </div>

        <Link
          to="/student/dashboard"
          className={styles.backButton}
        >
          Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <div className={styles.card}>
          <p className={styles.message}>
            Loading completed sessions...
          </p>
        </div>
      ) : sessions.length === 0 ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <h3>No completed sessions</h3>
            <p>
              Your completed sessions will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.sessionList}>
          {sessions.map((session) => (
            <div
              key={session.id}
              className={styles.sessionCard}
            >
              <div className={styles.sessionHeader}>
                <div>
                  <h2>{session.topic}</h2>

                  <p>
                    {formatDateTime(session.scheduled_at)}
                  </p>
                </div>

                <span className={styles.status}>
                  Completed
                </span>
              </div>

              <div className={styles.notesSection}>
                <h3>Session Notes</h3>

                {session.notes ? (
                  <div className={styles.notes}>
                    {session.notes}
                  </div>
                ) : (
                  <p className={styles.noNotes}>
                    No notes were added for this session.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedSessions;