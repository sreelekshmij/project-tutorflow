import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import { updateStudentSchema } from "./student.validation";

import styles from "./EditStudent.module.scss";

const EditStudent = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateStudentSchema),
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem("token");

        const response = await api.get(`/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const student = response.data.data;

        reset({
          fullName: student.profiles?.full_name || "",
          subject: student.subject || "",
          currentLevel: student.current_level || "",
          learningGoals: student.learning_goals || "",
          weakAreas: student.weak_areas || "",
        });
      } catch (error) {
        console.error("Fetch student error:", error);

        toast.error(
          error.response?.data?.message ||
          "Unable to load student."
        );

        navigate(`/tutor/students/${studentId}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, navigate, reset]);

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");

      await api.patch(
        `/students/${studentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Student updated successfully!");

      navigate(`/tutor/students/${studentId}`);
    } catch (error) {
      console.error("Update student error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to update student. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading student...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <button
            type="button"
            className={styles.backButton}
            onClick={() =>
              navigate(`/tutor/students/${studentId}`)
            }
          >
            ← Back to Student
          </button>

          <h1>Edit Student</h1>

          <p>
            Update this student's learning profile and
            information.
          </p>
        </div>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Basic Information</h2>
            <p>Update the student's basic details.</p>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                {...register("fullName")}
                placeholder="Enter student's full name"
              />

              {errors.fullName && (
                <span className={styles.error}>
                  {errors.fullName.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">
                Subject
              </label>

              <input
                id="subject"
                type="text"
                {...register("subject")}
                placeholder="e.g. Mathematics"
              />

              {errors.subject && (
                <span className={styles.error}>
                  {errors.subject.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="currentLevel">
                Current Level
              </label>

              <input
                id="currentLevel"
                type="text"
                {...register("currentLevel")}
                placeholder="e.g. Grade 10"
              />

              {errors.currentLevel && (
                <span className={styles.error}>
                  {errors.currentLevel.message}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Learning Profile</h2>
            <p>
              Information that helps you understand the
              student's learning needs.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="learningGoals">
              Learning Goals
            </label>

            <textarea
              id="learningGoals"
              rows="5"
              {...register("learningGoals")}
              placeholder="What does the student want to achieve?"
            />

            {errors.learningGoals && (
              <span className={styles.error}>
                {errors.learningGoals.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="weakAreas">
              Weak Areas
            </label>

            <textarea
              id="weakAreas"
              rows="5"
              {...register("weakAreas")}
              placeholder="What areas does the student struggle with?"
            />

            {errors.weakAreas && (
              <span className={styles.error}>
                {errors.weakAreas.message}
              </span>
            )}
          </div>
        </section>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() =>
              navigate(`/tutor/students/${studentId}`)
            }
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;