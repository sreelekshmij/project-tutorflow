/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../services/api";

import styles from "./Progress.module.scss";

const Progress = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const studentIdFromUrl = searchParams.get("studentId");

    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [progress, setProgress] = useState([]);

    const [studentsLoading, setStudentsLoading] = useState(true);
    const [progressLoading, setProgressLoading] = useState(false);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    const [aiSummary, setAiSummary] = useState(null);

    const fetchStudents = async () => {
        try {
            setStudentsLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.get("/students", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const studentList = response.data.data || [];

            setStudents(studentList);

            if (studentIdFromUrl) {
                const studentExists = studentList.some(
                    (student) => student.id === studentIdFromUrl
                );

                if (studentExists) {
                    setSelectedStudentId(studentIdFromUrl);
                }
            }
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

    const fetchStudentProgress = async (studentId) => {
        if (!studentId) {
            setProgress([]);
            setAiSummary(null);
            return;
        }

        try {
            setProgressLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.get(
                `/progress/${studentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProgress(response.data.data || []);

            // Clear the previous student's AI summary
            setAiSummary(null);
        } catch (error) {
            console.error("Fetch progress error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load student progress."
            );

            setProgress([]);
            setAiSummary(null);
        } finally {
            setProgressLoading(false);
        }
    };

    const handleGenerateSummary = async () => {
        if (!selectedStudentId) {
            toast.error("Please select a student.");
            return;
        }

        if (progress.length === 0) {
            toast.error(
                "At least one progress record is required."
            );
            return;
        }

        try {
            setIsGeneratingSummary(true);

            const token = localStorage.getItem("token");

            const response = await api.post(
                `/ai/students/${selectedStudentId}/progress-summary`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAiSummary(response.data.data);

            toast.success(
                "AI progress summary generated successfully."
            );
        } catch (error) {
            console.error(
                "Generate AI progress summary error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to generate AI progress summary."
            );
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [studentIdFromUrl]);

    useEffect(() => {
        fetchStudentProgress(selectedStudentId);
    }, [selectedStudentId]);

    const handleStudentChange = (event) => {
        setSelectedStudentId(event.target.value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const selectedStudent = students.find(
        (student) => student.id === selectedStudentId
    );

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>Progress</h1>
                    <p>
                        Track and review your students' learning progress.
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() =>
                        navigate(
                            selectedStudentId
                                ? `/tutor/progress/add?studentId=${selectedStudentId}`
                                : "/tutor/progress/add"
                        )
                    }
                >
                    Add Progress
                </button>
            </div>

            <div className={styles.card}>
                <div className={styles.filterHeader}>
                    <label htmlFor="student">
                        Select Student
                    </label>

                    <select
                        id="student"
                        value={selectedStudentId}
                        onChange={handleStudentChange}
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
                </div>
            </div>

            {!selectedStudentId ? (
                <div className={styles.emptyState}>
                    <h3>Select a student</h3>
                    <p>
                        Select a student above to view their progress.
                    </p>
                </div>
            ) : progressLoading ? (
                <div className={styles.emptyState}>
                    <p>Loading progress...</p>
                </div>
            ) : (
                <>
                    <div className={styles.card}>
                        <div className={styles.sectionHeader}>
                            <div>
                                <h2>
                                    {selectedStudent?.profiles?.full_name ||
                                        "Student"}{" "}
                                    - Progress
                                </h2>

                                <p>
                                    {progress.length}{" "}
                                    {progress.length === 1
                                        ? "progress record"
                                        : "progress records"}
                                </p>
                            </div>

                            {progress.length > 0 && (
                                <button
                                    type="button"
                                    className={styles.aiButton}
                                    onClick={handleGenerateSummary}
                                    disabled={isGeneratingSummary}
                                >
                                    {isGeneratingSummary
                                        ? "Generating..."
                                        : aiSummary
                                            ? "Regenerate AI Summary"
                                            : "Generate AI Summary"}
                                </button>
                            )}
                        </div>

                        {progress.length === 0 ? (
                            <div className={styles.emptyState}>
                                <h3>No progress records</h3>
                                <p>
                                    No progress has been recorded for this
                                    student yet.
                                </p>

                                <button
                                    type="button"
                                    className={styles.primaryButton}
                                    onClick={() =>
                                        navigate(
                                            `/tutor/progress/add?studentId=${selectedStudentId}`
                                        )
                                    }
                                >
                                    Add Progress
                                </button>
                            </div>
                        ) : (
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Topic</th>
                                            <th>Score</th>
                                            <th>Session</th>
                                            <th>Notes</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {progress.map((record) => (
                                            <tr key={record.id}>
                                                <td>
                                                    {formatDate(
                                                        record.created_at
                                                    )}
                                                </td>

                                                <td>{record.topic}</td>

                                                <td>
                                                    {record.score !== null &&
                                                        record.score !== undefined
                                                        ? `${record.score}%`
                                                        : "—"}
                                                </td>

                                                <td>
                                                    {record.sessions?.topic ||
                                                        "—"}
                                                </td>

                                                <td>
                                                    {record.notes || "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {aiSummary && (
                        <div className={styles.aiCard}>
                            <div className={styles.aiHeader}>
                                <div>
                                    <h2>AI Progress Summary</h2>
                                    <p>
                                        AI-generated insights based on the
                                        student's progress records.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.aiSection}>
                                <h3>Overall Progress</h3>

                                <p>
                                    {aiSummary.summary}
                                </p>
                            </div>

                            <div className={styles.aiSection}>
                                <h3>Strengths</h3>

                                <ul>
                                    {aiSummary.strengths?.map(
                                        (strength, index) => (
                                            <li key={index}>
                                                {strength}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            <div className={styles.aiSection}>
                                <h3>Areas to Improve</h3>

                                <ul>
                                    {aiSummary.areasToImprove?.map(
                                        (area, index) => (
                                            <li key={index}>
                                                {area}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            <div className={styles.aiSection}>
                                <h3>Recommended Focus</h3>

                                <ul>
                                    {aiSummary.recommendations?.map(
                                        (recommendation, index) => (
                                            <li key={index}>
                                                {recommendation}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Progress;
