import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../../../services/api";

import styles from "./Homework.module.scss";

const Homework = () => {
  const [homework, setHomework] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        setIsLoading(true);

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
        setIsLoading(false);
      }
    };

    fetchHomework();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading homework...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Homework</h1>
          <p>
            Review homework assigned from your completed
            sessions.
          </p>
        </div>
      </div>

      {homework.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No homework yet</h2>
          <p>
            Homework assigned by your tutor will appear here
            after a completed session.
          </p>
        </div>
      ) : (
        <div className={styles.homeworkList}>
          {homework.map((session) => (
            <section
              key={session.id}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <div>
                  <h2>{session.topic}</h2>

                  <p>
                    {session.scheduled_at
                      ? new Date(
                          session.scheduled_at
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3>Homework</h3>

                {Array.isArray(session.ai_homework) ? (
                  <ol>
                    {session.ai_homework.map(
                      (task, index) => (
                        <li key={index}>{task}</li>
                      )
                    )}
                  </ol>
                ) : (
                  <p>
                    No homework has been assigned for this
                    session.
                  </p>
                )}
              </div>

              {session.ai_next_focus && (
                <div className={styles.nextFocus}>
                  <h3>Next Session Focus</h3>

                  <p>{session.ai_next_focus}</p>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Homework;