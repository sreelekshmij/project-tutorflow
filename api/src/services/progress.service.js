const supabase = require("../config/supabase");

const createProgress = async ({
  studentId,
  sessionId,
  topic,
  score,
  notes,
  tutorId,
}) => {
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("id", studentId)
    .eq("tutor_id", tutorId)
    .single();

  if (studentError) {
    if (studentError.code === "PGRST116") {
      throw new Error("Student not found");
    }

    throw new Error(studentError.message);
  }

  if (sessionId) {
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id, student_id")
      .eq("id", sessionId)
      .eq("tutor_id", tutorId)
      .single();

    if (sessionError) {
      if (sessionError.code === "PGRST116") {
        throw new Error("Session not found");
      }

      throw new Error(sessionError.message);
    }

    if (session.student_id !== studentId) {
      throw new Error(
        "Session does not belong to this student"
      );
    }
  }

  const { data: progress, error: progressError } =
    await supabase
      .from("progress")
      .insert({
        student_id: studentId,
        session_id: sessionId || null,
        topic: topic.trim(),
        score: score ?? null,
        notes: notes || null,
      })
      .select(
        `
        id,
        student_id,
        session_id,
        topic,
        score,
        notes,
        created_at
        `
      )
      .single();

  if (progressError) {
    throw new Error(progressError.message);
  }

  return progress;
};

const getStudentProgress = async (studentId, tutorId) => {
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("id", studentId)
    .eq("tutor_id", tutorId)
    .single();

  if (studentError) {
    if (studentError.code === "PGRST116") {
      throw new Error("Student not found");
    }

    throw new Error(studentError.message);
  }

  const { data, error } = await supabase
    .from("progress")
    .select(
      `
      id,
      student_id,
      session_id,
      topic,
      score,
      notes,
      created_at,
      sessions (
        id,
        scheduled_at,
        topic,
        status
      )
      `
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  createProgress,
  getStudentProgress,
};