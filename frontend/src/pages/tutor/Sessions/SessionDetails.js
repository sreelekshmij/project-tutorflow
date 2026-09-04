import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import styles from "./SessionDetails.module.scss";

const SessionDetails = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] =
    useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const notesTimerRef = useRef(null);

  const fetchSession = async () => {
    try {
      setIsLoading(true);

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

      setSession(sessionData);
      setNotes(sessionData.notes || "");
    } catch (error) {
      console.error("Fetch session error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to load session."
      );

      navigate("/tutor/sessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();

    return () => {
      if (notesTimerRef.current) {
        clearTimeout(notesTimerRef.current);
      }
    };
  }, [sessionId]);

  const saveNotes = async (notesValue) => {
    try {
      setIsSavingNotes(true);
      setNotesSaved(false);

      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/sessions/${sessionId}/notes`,
        {
          notes: notesValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSession((previousSession) => ({
        ...previousSession,
        notes: response.data.data.notes,
      }));

      setNotesSaved(true);
    } catch (error) {
      console.error("Save notes error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to save notes."
      );
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleNotesChange = (event) => {
    const newNotes = event.target.value;

    setNotes(newNotes);
    setNotesSaved(false);

    if (notesTimerRef.current) {
      clearTimeout(notesTimerRef.current);
    }

    notesTimerRef.current = setTimeout(() => {
      saveNotes(newNotes);
    }, 500);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);

      const token = localStorage.getItem("token");

      const response = await api.patch(
        `/sessions/${sessionId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSession(response.data.data);

      toast.success(
        "Session status updated successfully!"
      );
    } catch (error) {
      console.error(
        "Update session status error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Unable to update session status."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  const formatStatus = (status) => {
    if (!status) {
      return "-";
    }

    return status
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }
  console.log(session, session.student)

  const student = session.students;
  const profile = student?.profiles;

  const isSessionInProgress =
    session.status === "in_progress";

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

          <h1>Session Details</h1>

          <p>
            View and manage this tutoring session.
          </p>
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.sessionHeader}>
          <div>
            <h2>{session.topic}</h2>

            <span
              className={`${styles.status} ${getStatusClass(
                session.status
              )}`}
            >
              {formatStatus(session.status)}
            </span>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span>Student</span>

            <strong>
              {profile?.full_name || "Unknown Student"}
            </strong>
          </div>

          <div className={styles.infoItem}>
            <span>Date</span>

            <strong>
              {formatDate(session.scheduled_at)}
            </strong>
          </div>

          <div className={styles.infoItem}>
            <span>Time</span>

            <strong>
              {formatTime(session.scheduled_at)}
            </strong>
          </div>

          <div className={styles.infoItem}>
            <span>Subject</span>

            <strong>
              {student?.subject || "-"}
            </strong>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.notesHeader}>
            <div>
              <h2>Session Notes</h2>

              <p>
                {isSessionInProgress
                  ? "Notes are automatically saved while you type."
                  : "Notes can only be edited while the session is in progress."}
              </p>
            </div>

            {isSessionInProgress && (
              <span className={styles.saveStatus}>
                {isSavingNotes
                  ? "Saving..."
                  : notesSaved
                    ? "Saved"
                    : ""}
              </span>
            )}
          </div>
        </div>

        {isSessionInProgress ? (
          <textarea
            className={styles.notesTextarea}
            value={notes}
            onChange={handleNotesChange}
            placeholder="Write your session notes here..."
            rows={10}
          />
        ) : (
          <div className={styles.notesBox}>
            {session.notes ? (
              <p>{session.notes}</p>
            ) : (
              <p className={styles.emptyText}>
                No session notes yet.
              </p>
            )}
          </div>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Session Status</h2>

          <p>
            Move the session through its lifecycle.
          </p>
        </div>

        <div className={styles.statusActions}>
          {session.status === "scheduled" && (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() =>
                handleStatusChange("in_progress")
              }
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus
                ? "Updating..."
                : "Start Session"}
            </button>
          )}

          {session.status === "in_progress" && (
            <button
              type="button"
              className={styles.completeButton}
              onClick={() =>
                handleStatusChange("completed")
              }
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus
                ? "Updating..."
                : "Complete Session"}
            </button>
          )}

          {session.status === "completed" && (
            <div className={styles.completedMessage}>
              <strong>Session completed</strong>

              <span>
                AI review will be available in the next
                stage.
              </span>
            </div>
          )}

          {session.status === "ai_reviewed" && (
            <div className={styles.completedMessage}>
              <strong>AI review completed</strong>

              <span>
                This session has completed its lifecycle.
              </span>
            </div>
          )}
        </div>

        {session.status !== "completed" &&
          session.status !== "ai_reviewed" && (
            <button
              type="button"
              onClick={() =>
                navigate(`/tutor/sessions/${session.id}/edit`)
              }
              className={styles.editButton}
            >
              Edit Session
            </button>
          )}
      </section>
    </div>
  );
};

export default SessionDetails;