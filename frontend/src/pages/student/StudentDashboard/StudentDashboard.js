import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import { useAuth } from "../../../context/AuthContext";

import api from "../../../services/api";

import styles from "./StudentDashboard.module.scss";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(
        "/student-portal/sessions/upcoming",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessions(response.data.data || []);
    } catch (error) {
      console.error("Fetch upcoming sessions error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to load upcoming sessions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingSessions();
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
          <h1>Student Dashboard</h1>
          <p>View your upcoming learning sessions.</p>
        </div>
        <button
          type="button"
          className={styles.logoutButton}
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Upcoming Sessions</h2>
        </div>

        {loading ? (
          <p className={styles.message}>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No upcoming sessions</h3>
            <p>
              Your tutor has not scheduled any upcoming sessions yet.
            </p>
          </div>
        ) : (
          <div className={styles.sessionList}>
            {sessions.map((session) => (
              <div
                key={session.id}
                className={styles.sessionItem}
              >
                <div>
                  <h3>{session.topic}</h3>

                  <p>
                    {formatDateTime(session.scheduled_at)}
                  </p>

                  {session.students?.subject && (
                    <p>
                      Subject: {session.students.subject}
                    </p>
                  )}
                </div>

                <span className={styles.status}>
                  {session.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className={styles.actions}>
        <Link
          to="/student/completed-sessions"
          className={styles.secondaryButton}
        >
          View Completed Sessions
        </Link>

        <Link
          to="/student/homework"
          className={styles.primaryButton}
        >
          View Homework
        </Link>
      </div>
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default StudentDashboard;