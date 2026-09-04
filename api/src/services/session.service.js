const supabase = require("../config/supabase");

const createSession = async ({
  tutorId,
  studentId,
  scheduledAt,
  topic,
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
  console.log("scheduledAt before Supabase:", scheduledAt);
  console.log(
    "scheduledAt type:",
    typeof scheduledAt
  );

  const { data: existingSession, error: existingSessionError } =
    await supabase
      .from("sessions")
      .select("id")
      .eq("tutor_id", tutorId)
      .eq("scheduled_at", scheduledAt.toISOString())
      .neq("status", "completed")
      .neq("status", "ai_reviewed")
      .maybeSingle();

  if (existingSessionError) {
    throw new Error(existingSessionError.message);
  }

  if (existingSession) {
    throw new Error("Tutor already has a session scheduled at this time");
  }

  console.log("scheduledAt before Supabase: ==== >", scheduledAt);
  console.log(
    "scheduledAt type: =>",
    typeof scheduledAt
  );
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      tutor_id: tutorId,
      student_id: studentId,
      scheduled_at: scheduledAt.toISOString(),
      topic: topic.trim(),
      status: "scheduled",
    })
    .select(
      `
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
      updated_at
      `
    )
    .single();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  return session;
};

const getSessions = async (tutorId) => {
  const { data, error } = await supabase
    .from("sessions")
    .select(
      `
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
        profiles!students_profile_id_fkey (
          id,
          full_name,
          email
        )
      )
      `
    )
    .eq("tutor_id", tutorId)
    .order("scheduled_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const getSessionById = async (sessionId, tutorId) => {
  const { data, error } = await supabase
    .from("sessions")
    .select(
      `
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
      `
    )
    .eq("id", sessionId)
    .eq("tutor_id", tutorId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Session not found");
    }

    throw new Error(error.message);
  }

  return data;
};

const updateSession = async (
  sessionId,
  tutorId,
  { scheduledAt, topic }
) => {
  const { data: existingSession, error: existingError } = await supabase
    .from("sessions")
    .select("id, status")
    .eq("id", sessionId)
    .eq("tutor_id", tutorId)
    .single();

  if (existingError) {
    if (existingError.code === "PGRST116") {
      throw new Error("Session not found");
    }

    throw new Error(existingError.message);
  }

  if (
    existingSession.status === "completed" ||
    existingSession.status === "ai_reviewed"
  ) {
    throw new Error("Completed sessions cannot be edited");
  }

  const updates = {};

  if (scheduledAt !== undefined) {
    updates.scheduled_at = scheduledAt.toISOString();
  }

  if (topic !== undefined) {
    updates.topic = topic.trim();
  }

  updates.updated_at = new Date().toISOString();

  if (scheduledAt !== undefined) {
    const { data: conflictingSession, error: conflictError } =
      await supabase
        .from("sessions")
        .select("id")
        .eq("tutor_id", tutorId)
        .eq("scheduled_at", scheduledAt.toISOString())
        .neq("id", sessionId)
        .neq("status", "completed")
        .neq("status", "ai_reviewed")
        .maybeSingle();

    if (conflictError) {
      throw new Error(conflictError.message);
    }

    if (conflictingSession) {
      throw new Error(
        "Tutor already has a session scheduled at this time"
      );
    }
  }

  const { data: session, error: updateError } = await supabase
    .from("sessions")
    .update(updates)
    .eq("id", sessionId)
    .eq("tutor_id", tutorId)
    .select(
      `
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
        profiles!students_profile_id_fkey (
          id,
          full_name,
          email
        )
      )
      `
    )
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return session;
};

const updateSessionStatus = async (
  sessionId,
  tutorId,
  newStatus
) => {
  const { data: session, error } = await supabase
    .from("sessions")
    .select("id, status")
    .eq("id", sessionId)
    .eq("tutor_id", tutorId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Session not found");
    }

    throw new Error(error.message);
  }

  const allowedTransitions = {
    scheduled: ["in_progress"],
    in_progress: ["completed"],
    completed: ["ai_reviewed"],
    ai_reviewed: [],
  };

  const allowedNextStatuses = allowedTransitions[session.status];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${session.status} → ${newStatus}`
    );
  }

  const { data: updatedSession, error: updateError } =
    await supabase
      .from("sessions")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("tutor_id", tutorId)
      .select(
        `
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
        profiles!students_profile_id_fkey (
          id,
          full_name,
          email
        )
      )
        `
      )
      .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return updatedSession;
};

const updateSessionNotes = async (
  sessionId,
  tutorId,
  notes
) => {
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, status")
    .eq("id", sessionId)
    .eq("tutor_id", tutorId)
    .single();

  if (sessionError) {
    if (sessionError.code === "PGRST116") {
      throw new Error("Session not found");
    }

    throw new Error(sessionError.message);
  }

  if (session.status !== "in_progress") {
    throw new Error(
      "Notes can only be updated while the session is in progress"
    );
  }

  const { data: updatedSession, error: updateError } =
    await supabase
      .from("sessions")
      .update({
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("tutor_id", tutorId)
      .select(
        `
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
        profiles!students_profile_id_fkey (
          id,
          full_name,
          email
        )
      )
        `
      )
      .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return updatedSession;
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  updateSessionStatus,
  updateSessionNotes,
};