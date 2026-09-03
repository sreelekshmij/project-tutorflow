import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import api from "../../../services/api";
import { createStudentSchema } from "./student.validation";

import styles from "./Students.module.scss";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createStudentSchema),
  });

  const fetchStudents = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Fetch students error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to load students."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openModal = () => {
    reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    reset();
    setIsModalOpen(false);
  };

  const onSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      await api.post("/students", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Student created successfully!");

      reset();
      setIsModalOpen(false);

      fetchStudents();
    } catch (error) {
      console.error("Create student error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to create student."
      );
    }
  };

  return (
    <div className={styles.studentsPage}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Students</h1>

          <p>
            Manage your students and their learning profiles.
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={openModal}
        >
          + Add Student
        </button>
      </div>

      {/* Student List */}
      <div className={styles.studentCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2>All Students</h2>

            <p>
              {students.length}{" "}
              {students.length === 1 ? "student" : "students"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>
            <p>Loading students...</p>
          </div>
        ) : students.length === 0 ? (
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
              onClick={openModal}
            >
              Add Student
            </button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.studentTable}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Current Level</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className={styles.studentInfo}>
                        <div className={styles.avatar}>
                          {student.profiles?.full_name
                            ?.charAt(0)
                            ?.toUpperCase() || "S"}
                        </div>

                        <div>
                          <strong>
                            {student.profiles?.full_name ||
                              "Unknown Student"}
                          </strong>

                          <span>
                            {student.profiles?.email || "-"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>{student.subject || "-"}</td>

                    <td>
                      {student.current_level || "-"}
                    </td>

                    <td>
                      {student.created_at
                        ? new Date(
                          student.created_at
                        ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={styles.viewButton}
                        onClick={() =>
                          navigate(`/tutor/students/${student.id}`)
                        }
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

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Add Student</h2>

                <p>
                  Create a student profile and login account.
                </p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeModal}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <form
              className={styles.studentForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter student's name"
                    {...register("fullName")}
                  />

                  {errors.fullName && (
                    <p className={styles.fieldError}>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter student's email"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className={styles.fieldError}>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="password">
                    Temporary Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    {...register("password")}
                  />

                  {errors.password && (
                    <p className={styles.fieldError}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>

                  <input
                    id="subject"
                    type="text"
                    placeholder="e.g. Mathematics"
                    {...register("subject")}
                  />

                  {errors.subject && (
                    <p className={styles.fieldError}>
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="currentLevel">
                  Current Level
                </label>

                <input
                  id="currentLevel"
                  type="text"
                  placeholder="e.g. Grade 10 / Beginner"
                  {...register("currentLevel")}
                />

                {errors.currentLevel && (
                  <p className={styles.fieldError}>
                    {errors.currentLevel.message}
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="learningGoals">
                  Learning Goals
                </label>

                <textarea
                  id="learningGoals"
                  rows="3"
                  placeholder="What does the student want to achieve?"
                  {...register("learningGoals")}
                />

                {errors.learningGoals && (
                  <p className={styles.fieldError}>
                    {errors.learningGoals.message}
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="weakAreas">
                  Weak Areas
                </label>

                <textarea
                  id="weakAreas"
                  rows="3"
                  placeholder="What areas does the student struggle with?"
                  {...register("weakAreas")}
                />

                {errors.weakAreas && (
                  <p className={styles.fieldError}>
                    {errors.weakAreas.message}
                  </p>
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Creating..."
                    : "Create Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;