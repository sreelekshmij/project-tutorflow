import { useAuth } from "../../../context/AuthContext";

import styles from "./TutorDashboard.module.scss";

const TutorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, {user?.full_name || "Tutor"}! Here's an
            overview of your tutoring activity.
          </p>
        </div>

        <button type="button" className={styles.primaryButton}>
          + Schedule Session
        </button>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Total Students</span>
            <div className={styles.statIcon}>👥</div>
          </div>

          <strong>0</strong>

          <span className={styles.statDescription}>
            Students currently enrolled
          </span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Upcoming Sessions</span>
            <div className={styles.statIcon}>📅</div>
          </div>

          <strong>0</strong>

          <span className={styles.statDescription}>
            Sessions scheduled
          </span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Completed Sessions</span>
            <div className={styles.statIcon}>✓</div>
          </div>

          <strong>0</strong>

          <span className={styles.statDescription}>
            Sessions completed
          </span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>AI Reviewed</span>
            <div className={styles.statIcon}>✨</div>
          </div>

          <strong>0</strong>

          <span className={styles.statDescription}>
            Sessions reviewed by AI
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.contentGrid}>
        {/* Upcoming Sessions */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Upcoming Sessions</h2>
              <p>Your next scheduled tutoring sessions</p>
            </div>

            <button
              type="button"
              className={styles.textButton}
            >
              View All
            </button>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>

            <h3>No upcoming sessions</h3>

            <p>
              You don't have any sessions scheduled yet.
            </p>

            <button
              type="button"
              className={styles.secondaryButton}
            >
              Schedule a Session
            </button>
          </div>
        </section>

        {/* Students */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Recent Students</h2>
              <p>Your recently added students</p>
            </div>

            <button
              type="button"
              className={styles.textButton}
            >
              View All
            </button>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>

            <h3>No students yet</h3>

            <p>
              Add your first student to start managing their
              learning journey.
            </p>

            <button
              type="button"
              className={styles.secondaryButton}
            >
              Add Student
            </button>
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Quick Actions</h2>
            <p>Common actions you may want to take</p>
          </div>
        </div>

        <div className={styles.actionGrid}>
          <button
            type="button"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>👤</div>

            <div>
              <h3>Add Student</h3>
              <p>Create a new student profile</p>
            </div>
          </button>

          <button
            type="button"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>📅</div>

            <div>
              <h3>Schedule Session</h3>
              <p>Schedule a session with a student</p>
            </div>
          </button>

          <button
            type="button"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>📈</div>

            <div>
              <h3>View Progress</h3>
              <p>Track student learning progress</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default TutorDashboard;