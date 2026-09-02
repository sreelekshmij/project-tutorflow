const supabase = require("../config/supabase");

const getUpcomingSessions = async (studentProfileId) => {
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", studentProfileId)
    .single();

  if (studentError) {
    if (studentError.code === "PGRST116") {
      throw new Error("Student profile not found");
    }

    throw new Error(studentError.message);
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select(
      `
      id,
      scheduled_at,
      topic,
      status,
      created_at,
      updated_at
      `
    )
    .eq("student_id", student.id)
    .in("status", ["scheduled", "in_progress"])
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true });

  if (sessionsError) {
    throw new Error(sessionsError.message);
  }

  return sessions;
};

const getCompletedSessions = async (studentProfileId) => {
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", studentProfileId)
    .single();

  if (studentError) {
    if (studentError.code === "PGRST116") {
      throw new Error("Student profile not found");
    }

    throw new Error(studentError.message);
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select(
      `
      id,
      scheduled_at,
      topic,
      status,
      notes,
      ai_summary,
      ai_homework,
      ai_next_focus,
      created_at,
      updated_at
      `
    )
    .eq("student_id", student.id)
    .in("status", ["completed", "ai_reviewed"])
    .order("scheduled_at", { ascending: false });

  if (sessionsError) {
    throw new Error(sessionsError.message);
  }

  return sessions;
};

const getHomework = async (studentProfileId) => {
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", studentProfileId)
    .single();

  if (studentError) {
    if (studentError.code === "PGRST116") {
      throw new Error("Student profile not found");
    }

    throw new Error(studentError.message);
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select(
      `
      id,
      scheduled_at,
      topic,
      ai_homework,
      ai_next_focus
      `
    )
    .eq("student_id", student.id)
    .eq("status", "ai_reviewed")
    .not("ai_homework", "is", null)
    .order("scheduled_at", { ascending: false });

  if (sessionsError) {
    throw new Error(sessionsError.message);
  }

  return sessions;
};

module.exports = {
  getUpcomingSessions,
  getCompletedSessions,
  getHomework,
};