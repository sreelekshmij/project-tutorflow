import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import styles from "./Homework.module.scss";

const Homework = () => {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomework = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(
        "/student-portal/homework",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHomework(response.data.data || []);
    } catch (error) {
      console.error("Fetch homework error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load homework."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Homework</h1>
          <p>Review the homework assigned after your sessions.</p>
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
            Loading homework...
          </p>
        </div>
      ) : homework.length === 0 ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <h3>No homework yet</h3>
            <p>
              Homework assigned after your sessions will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.homeworkList}>
          {homework.map((item, index) => (
            <div
              key={item.id || index}
              className={styles.homeworkCard}
            >
              <div className={styles.homeworkHeader}>
                <h2>
                  {item.session_topic || "Session Homework"}
                </h2>

                {item.scheduled_at && (
                  <span>
                    {new Date(
                      item.scheduled_at
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>

              {Array.isArray(item.homework) ? (
                <ol className={styles.taskList}>
                  {item.homework.map((task, taskIndex) => (
                    <li key={taskIndex}>{task}</li>
                  ))}
                </ol>
              ) : (
                <p className={styles.homeworkText}>
                  {item.homework || "No homework details available."}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Homework;