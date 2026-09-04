import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";
import { createProgressSchema } from "./progress.validation";

import styles from "./AddProgress.module.scss";

const AddProgress = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const preselectedStudentId =
        searchParams.get("studentId") || "";

    const [students, setStudents] = useState([]);
    const [sessions, setSessions] = useState([]);

    const [studentsLoading, setStudentsLoading] =
        useState(true);
    const [sessionsLoading, setSessionsLoading] =
        useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(createProgressSchema),
        defaultValues: {
            studentId: preselectedStudentId,
            sessionId: "",
            topic: "",
            score: "",
            notes: "",
        },
    });

    const selectedStudentId = watch("studentId");

    const fetchStudents = async () => {
        try {
            setStudentsLoading(true);

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
            setStudentsLoading(false);
        }
    };

    const fetchStudentSessions = async (studentId) => {
        if (!studentId) {
            setSessions([]);
            return;
        }

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
                (session) =>
                    session.student_id === studentId &&
                    session.status === "completed"
            );

            setSessions(studentSessions);
        } catch (error) {
            console.error("Fetch sessions error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load sessions."
            );

            setSessions([]);
        } finally {
            setSessionsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        fetchStudentSessions(selectedStudentId);

        reset((currentValues) => ({
            ...currentValues,
            sessionId: "",
        }));
    }, [selectedStudentId, reset]);

    const onSubmit = async (formData) => {
        try {
            const token = localStorage.getItem("token");

            await api.post(
                "/progress",
                {
                    studentId: formData.studentId,
                    sessionId: formData.sessionId || null,
                    topic: formData.topic,
                    score:
                        formData.score === "" ||
                            formData.score === null
                            ? null
                            : Number(formData.score),
                    notes: formData.notes || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Progress recorded successfully."
            );

            navigate(
                `/tutor/progress?studentId=${formData.studentId}`
            );
        } catch (error) {
            console.error("Create progress error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to record progress."
            );
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>Add Progress</h1>
                    <p>
                        Record a student's learning progress.
                    </p>
                </div>
            </div>

            <div className={styles.card}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formGroup}>
                        <label htmlFor="studentId">
                            Student
                        </label>

                        <select
                            id="studentId"
                            {...register("studentId")}
                            disabled={studentsLoading}
                        >
                            <option value="">
                                {studentsLoading
                                    ? "Loading students..."
                                    : "Select a student"}
                            </option>

                            {students.map((student) => (
                                <option
                                    key={student.id}
                                    value={student.id}
                                >
                                    {student.profiles?.full_name ||
                                        "Unknown student"}
                                </option>
                            ))}
                        </select>

                        {errors.studentId && (
                            <p className={styles.error}>
                                {errors.studentId.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="sessionId">
                            Session
                        </label>

                        <select
                            id="sessionId"
                            {...register("sessionId")}
                            disabled={
                                !selectedStudentId ||
                                sessionsLoading
                            }
                        >
                            <option value="">
                                {!selectedStudentId
                                    ? "Select a student first"
                                    : sessionsLoading
                                        ? "Loading sessions..."
                                        : sessions.length === 0
                                            ? "No completed sessions"
                                            : "Select a session (optional)"}
                            </option>

                            {sessions.map((session) => (
                                <option
                                    key={session.id}
                                    value={session.id}
                                >
                                    {session.topic} -{" "}
                                    {new Date(
                                        session.scheduled_at
                                    ).toLocaleDateString()}
                                </option>
                            ))}
                        </select>

                        {errors.sessionId && (
                            <p className={styles.error}>
                                {errors.sessionId.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="topic">
                            Topic
                        </label>

                        <input
                            id="topic"
                            type="text"
                            placeholder="e.g. Quadratic Equations"
                            {...register("topic")}
                        />

                        {errors.topic && (
                            <p className={styles.error}>
                                {errors.topic.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="score">
                            Score
                        </label>

                        <input
                            id="score"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0 - 100"
                            {...register("score")}
                        />

                        {errors.score && (
                            <p className={styles.error}>
                                {errors.score.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            rows="5"
                            placeholder="Add notes about the student's performance..."
                            {...register("notes")}
                        />

                        {errors.notes && (
                            <p className={styles.error}>
                                {errors.notes.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() =>
                                navigate("/tutor/progress")
                            }
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
                                : "Save Progress"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProgress;
