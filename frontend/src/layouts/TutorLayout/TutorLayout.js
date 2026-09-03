import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import styles from "./TutorLayout.module.scss";

const TutorLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>TutorFlow</h2>
          <span>Tutor Portal</span>
        </div>

        <nav className={styles.navigation}>
          <NavLink
            to="/tutor/dashboard"
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/tutor/students"
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
          >
            Students
          </NavLink>

          <NavLink
            to="/tutor/sessions"
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
          >
            Sessions
          </NavLink>

          <NavLink
            to="/tutor/progress"
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
          >
            Progress
          </NavLink>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <strong>{user?.full_name}</strong>
            <span>{user?.email}</span>
          </div>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default TutorLayout;