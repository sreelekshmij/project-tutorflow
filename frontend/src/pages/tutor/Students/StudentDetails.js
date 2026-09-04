import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import styles from "./StudentDetails.module.scss";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";

const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const formatStatus = (status) => {
    return status
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const fetchStudent = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(`/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudent(response.data.data);
    } catch (error) {
      console.error("Fetch student error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to load student."
      );

      navigate("/tutor/students");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentSessions = async () => {
    try {
      setSessionsLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allSessions = response.data.data || [];

      const studentSessions = allSessions.filter(
        (session) => session.student_id === studentId
      );

      setSessions(studentSessions);
    } catch (error) {
      console.error("Fetch student sessions error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to load session history."
      );
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchStudentSessions();
  }, [studentId]);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      await api.delete(`/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Student deleted successfully.");

      navigate("/tutor/students");
    } catch (error) {
      console.error("Delete student error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to delete student."
      );
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading student...</p>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const profile = student.profiles;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/tutor/students")}
          >
            ← Back to Students
          </button>

          <h1>Student Details</h1>

          <p>
            View and manage this student's learning profile.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.editButton}
            onClick={() =>
              navigate(`/tutor/students/${studentId}/edit`)
            }
          >
            Edit Student
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Student"}
          </button>
        </div>
      </div>

      {/* Student Overview */}
      <section className={styles.card}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {profile?.full_name
              ?.charAt(0)
              ?.toUpperCase() || "S"}
          </div>

          <div>
            <h2>
              {profile?.full_name || "Unknown Student"}
            </h2>

            <p>{profile?.email || "-"}</p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span>Subject</span>
            <strong>{student.subject || "-"}</strong>
          </div>

          <div className={styles.infoItem}>
            <span>Current Level</span>
            <strong>
              {student.current_level || "-"}
            </strong>
          </div>

          <div className={styles.infoItem}>
            <span>Student Since</span>
            <strong>
              {student.created_at
                ? new Date(
                  student.created_at
                ).toLocaleDateString()
                : "-"}
            </strong>
          </div>
        </div>
      </section>

      {/* Learning Profile */}
      <div className={styles.profileGrid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Learning Goals</h2>
          </div>

          <div className={styles.cardContent}>
            {student.learning_goals ? (
              <p>{student.learning_goals}</p>
            ) : (
              <p className={styles.emptyText}>
                No learning goals added yet.
              </p>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Weak Areas</h2>
          </div>

          <div className={styles.cardContent}>
            {student.weak_areas ? (
              <p>{student.weak_areas}</p>
            ) : (
              <p className={styles.emptyText}>
                No weak areas identified yet.
              </p>
            )}
          </div>
        </section>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Session History</h2>

          <button
            type="button"
            onClick={() =>
              navigate(`/tutor/sessions/create?studentId=${studentId}`)
            }
            className={styles.primaryButton}
          >
            Schedule Session
          </button>
        </div>

        {sessionsLoading ? (
          <p className={styles.emptyText}>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No sessions found for this student.</p>

            <button
              type="button"
              onClick={() =>
                navigate(`/tutor/sessions/create?studentId=${studentId}`)
              }
              className={styles.primaryButton}
            >
              Schedule First Session
            </button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{formatDateTime(session.scheduled_at)}</td>

                    <td>{session.topic}</td>

                    <td>
  <span
    className={`${styles.status} ${styles[session.status]}`}
  >
    {formatStatus(session.status)}
  </span>
</td>

                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/tutor/sessions/${session.id}`)
                        }
                        className={styles.viewButton}
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
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Student"
        message={`Are you sure you want to delete ${student?.profiles?.full_name || "this student"
          }? This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        danger
      />
    </div>
  );
};

export default StudentDetails;