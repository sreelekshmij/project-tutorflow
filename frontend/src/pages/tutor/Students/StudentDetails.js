import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import styles from "./StudentDetails.module.scss";

const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const token = localStorage.getItem("token");

      await api.delete(`/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Student deleted successfully!");

      navigate("/tutor/students");
    } catch (error) {
      console.error("Delete student error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to delete student."
      );

      setIsDeleting(false);
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
            onClick={handleDelete}
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

      {/* Session History */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Session History</h2>

            <p>
              Track this student's sessions and learning
              progress.
            </p>
          </div>
        </div>

        <div className={styles.emptySessionState}>
          <div className={styles.sessionIcon}>📅</div>

          <h3>No sessions yet</h3>

          <p>
            Once you schedule sessions with this student,
            they will appear here.
          </p>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() =>
              navigate(
                `/tutor/sessions/create?studentId=${studentId}`
              )
            }
          >
            Schedule Session
          </button>
        </div>
      </section>
    </div>
  );
};

export default StudentDetails;