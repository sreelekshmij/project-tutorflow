import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import styles from "./TutorDashboard.module.scss";

const TutorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [studentsResponse, sessionsResponse] =
        await Promise.all([
          api.get("/students", config),
          api.get("/sessions", config),
        ]);

      setStudents(studentsResponse.data.data || []);
      setSessions(sessionsResponse.data.data || []);
    } catch (error) {
      console.error("Fetch dashboard data error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const upcomingSessions = sessions
    .filter(
      (session) =>
        session.status === "scheduled" ||
        session.status === "in_progress"
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at) -
        new Date(b.scheduled_at)
    );

  const completedSessions = sessions.filter(
    (session) =>
      session.status === "completed" ||
      session.status === "ai_reviewed"
  );

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

  const formatStatus = (status) => {
    return status
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.message}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Tutor Dashboard</h1>
          <p>
            Manage your students and upcoming learning sessions.
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>
            Total Students
          </span>

          <strong className={styles.statValue}>
            {students.length}
          </strong>

          <Link to="/tutor/students">
            View Students
          </Link>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>
            Upcoming Sessions
          </span>

          <strong className={styles.statValue}>
            {upcomingSessions.length}
          </strong>

          <Link to="/tutor/sessions">
            View Sessions
          </Link>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>
            Completed Sessions
          </span>

          <strong className={styles.statValue}>
            {completedSessions.length}
          </strong>

          <Link to="/tutor/progress">
            View Progress
          </Link>
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2>Upcoming Sessions</h2>
            <p>Your next scheduled sessions.</p>
          </div>

          <Link
            to="/tutor/sessions"
            className={styles.viewAll}
          >
            View All
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No upcoming sessions</h3>

            <p>
              Schedule a session with one of your students.
            </p>

            <Link
              to="/tutor/sessions/create"
              className={styles.primaryButton}
            >
              Schedule Session
            </Link>
          </div>
        ) : (
          <div className={styles.sessionList}>
            {upcomingSessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className={styles.sessionItem}
              >
                <div>
                  <h3>{session.topic}</h3>

                  <p>
                    Student:{" "}
                    {session.students?.profiles?.full_name ||
                      "Unknown Student"}
                  </p>

                  <p>
                    {formatDateTime(session.scheduled_at)}
                  </p>
                </div>

                <div className={styles.sessionRight}>
                  <span
                    className={`${styles.status} ${
                      styles[session.status]
                    }`}
                  >
                    {formatStatus(session.status)}
                  </span>

                  <Link
                    to={`/tutor/sessions/${session.id}`}
                    className={styles.viewButton}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.quickActions}>
        <h2>Quick Actions</h2>

        <div className={styles.actionGrid}>
          <Link
            to="/tutor/students"
            className={styles.actionCard}
          >
            <strong>Manage Students</strong>
            <span>Add or update student profiles.</span>
          </Link>

          <Link
            to="/tutor/sessions/create"
            className={styles.actionCard}
          >
            <strong>Schedule Session</strong>
            <span>Schedule a new learning session.</span>
          </Link>

          <Link
            to="/tutor/progress"
            className={styles.actionCard}
          >
            <strong>Track Progress</strong>
            <span>Review student learning progress.</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TutorDashboard;