const supabase = require("../config/supabase");
const aiService = require("../services/ai.service");

const generateSessionPlan = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const tutorId = req.user.userId;

        const { data: session, error: sessionError } = await supabase
            .from("sessions")
            .select(`
        id,
        tutor_id,
        student_id,
        topic,
        status,
        students (
          id,
          subject,
          current_level,
          learning_goals,
          weak_areas,
          profiles!students_profile_id_fkey (
            id,
            full_name,
            email
          )
        )
      `)
            .eq("id", sessionId)
            .eq("tutor_id", tutorId)
            .single();

        if (sessionError) {
            if (sessionError.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Session not found",
                });
            }

            throw new Error(sessionError.message);
        }

        if (session.status !== "scheduled") {
            return res.status(400).json({
                success: false,
                message:
                    "AI lesson plan can only be generated for scheduled sessions.",
            });
        }

        const student = session.students;

        const aiPlan = await aiService.generateSessionPlan({
            subject: student.subject,
            currentLevel: student.current_level,
            learningGoals: student.learning_goals,
            weakAreas: student.weak_areas,
            topic: session.topic,
        });

        const { data: updatedSession, error: updateError } =
            await supabase
                .from("sessions")
                .update({
                    ai_plan: aiPlan,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", sessionId)
                .eq("tutor_id", tutorId)
                .select(`
          id,
          tutor_id,
          student_id,
          scheduled_at,
          topic,
          status,
          notes,
          ai_plan,
          ai_summary,
          ai_homework,
          ai_next_focus,
          created_at,
          updated_at,
          students (
            id,
            subject,
            current_level,
            learning_goals,
            weak_areas,
            profiles!students_profile_id_fkey (
              id,
              full_name,
              email
            )
          )
        `)
                .single();

        if (updateError) {
            throw new Error(updateError.message);
        }

        return res.status(200).json({
            success: true,
            message: "AI lesson plan generated successfully.",
            data: updatedSession,
        });
    } catch (error) {
        console.error("Generate AI session plan error:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message || "Unable to generate AI lesson plan.",
        });
    }
};

const generateSessionDebrief = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const tutorId = req.user.userId;

        const { data: session, error: sessionError } =
            await supabase
                .from("sessions")
                .select(`
          id,
          tutor_id,
          student_id,
          topic,
          status,
          notes,
          students (
            id,
            subject,
            current_level,
            learning_goals,
            weak_areas,
            profiles!students_profile_id_fkey (
              id,
              full_name,
              email
            )
          )
        `)
                .eq("id", sessionId)
                .eq("tutor_id", tutorId)
                .single();

        if (sessionError) {
            if (sessionError.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Session not found",
                });
            }

            throw new Error(sessionError.message);
        }

        if (session.status !== "completed") {
            return res.status(400).json({
                success: false,
                message:
                    "AI debrief can only be generated for completed sessions.",
            });
        }

        if (!session.notes || !session.notes.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Session notes are required to generate an AI debrief.",
            });
        }

        const student = session.students;

        const aiDebrief =
            await aiService.generateSessionDebrief({
                subject: student.subject,
                currentLevel: student.current_level,
                learningGoals: student.learning_goals,
                weakAreas: student.weak_areas,
                topic: session.topic,
                notes: session.notes,
            });

        const { data: updatedSession, error: updateError } =
            await supabase
                .from("sessions")
                .update({
                    ai_summary: aiDebrief.summary,
                    ai_homework: aiDebrief.homework,
                    ai_next_focus: aiDebrief.nextFocus,
                    status: "ai_reviewed",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", sessionId)
                .eq("tutor_id", tutorId)
                .select(`
          id,
          tutor_id,
          student_id,
          scheduled_at,
          topic,
          status,
          notes,
          ai_plan,
          ai_summary,
          ai_homework,
          ai_next_focus,
          created_at,
          updated_at,
          students (
            id,
            subject,
            current_level,
            learning_goals,
            weak_areas,
            profiles!students_profile_id_fkey (
              id,
              full_name,
              email
            )
          )
        `)
                .single();

        if (updateError) {
            throw new Error(updateError.message);
        }

        return res.status(200).json({
            success: true,
            message: "AI session debrief generated successfully.",
            data: updatedSession,
        });
    } catch (error) {
        console.error(
            "Generate AI session debrief error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to generate AI session debrief.",
        });
    }
};

const generateProgressSummary = async (req, res) => {
    try {
        const { studentId } = req.params;

        const tutorId = req.user.userId;

        const { data: student, error: studentError } =
            await supabase
                .from("students")
                .select(`
          id,
          subject,
          current_level,
          learning_goals,
          weak_areas,
          profiles!students_profile_id_fkey (
            id,
            full_name,
            email
          )
        `)
                .eq("id", studentId)
                .eq("tutor_id", tutorId)
                .single();

        if (studentError) {
            if (studentError.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Student not found",
                });
            }

            throw new Error(studentError.message);
        }

        const { data: progressRecords, error: progressError } =
            await supabase
                .from("progress")
                .select(`
          id,
          topic,
          score,
          notes,
          created_at
        `)
                .eq("student_id", studentId)
                .order("created_at", {
                    ascending: true,
                });

        if (progressError) {
            throw new Error(progressError.message);
        }

        if (!progressRecords || progressRecords.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one progress record is required to generate an AI summary.",
            });
        }

        const aiSummary =
            await aiService.generateProgressSummary({
                studentName:
                    student.profiles?.full_name || "Student",
                subject: student.subject,
                currentLevel: student.current_level,
                learningGoals: student.learning_goals,
                weakAreas: student.weak_areas,
                progressRecords,
            });

        return res.status(200).json({
            success: true,
            message:
                "AI progress summary generated successfully.",
            data: aiSummary,
        });
    } catch (error) {
        console.error(
            "Generate AI progress summary error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to generate AI progress summary.",
        });
    }
};

module.exports = {
    generateSessionPlan,
    generateSessionDebrief,
    generateProgressSummary,
};