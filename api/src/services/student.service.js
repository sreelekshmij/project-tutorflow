const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const supabase = require("../config/supabase");

const createStudent = async ({
  fullName,
  email,
  password,
  subject,
  currentLevel,
  learningGoals,
  weakAreas,
  tutorId,
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const { data: existingUser, error: existingUserError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingUserError) {
    throw new Error(existingUserError.message);
  }

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const profileId = randomUUID();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: profileId,
      full_name: fullName.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      role: "student",
    })
    .select("id, full_name, email, role, created_at")
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
      profile_id: profileId,
      tutor_id: tutorId,
      subject: subject.trim(),
      current_level: currentLevel || null,
      learning_goals: learningGoals || null,
      weak_areas: weakAreas || null,
    })
    .select(
      `
      id,
      profile_id,
      tutor_id,
      subject,
      current_level,
      learning_goals,
      weak_areas,
      created_at,
      updated_at
      `
    )
    .single();

  if (studentError) {
    await supabase
      .from("profiles")
      .delete()
      .eq("id", profileId);

    throw new Error(studentError.message);
  }

  return {
    ...student,
    profile,
  };
};

const getStudents = async (tutorId) => {
  const { data, error } = await supabase
    .from("students")
    .select(
      `
      id,
      profile_id,
      tutor_id,
      subject,
      current_level,
      learning_goals,
      weak_areas,
      created_at,
      updated_at,
      profiles!students_profile_id_fkey (
        id,
        full_name,
        email
      )
      `
    )
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const getStudentById = async (studentId, tutorId) => {
  const { data, error } = await supabase
    .from("students")
    .select(
      `
      id,
      profile_id,
      tutor_id,
      subject,
      current_level,
      learning_goals,
      weak_areas,
      created_at,
      updated_at,
      profiles!students_profile_id_fkey (
        id,
        full_name,
        email
      )
      `
    )
    .eq("id", studentId)
    .eq("tutor_id", tutorId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Student not found");
    }

    throw new Error(error.message);
  }

  return data;
};

const updateStudent = async (studentId, tutorId, updates) => {
  const allowedFields = {
    fullName: updates.fullName,
    subject: updates.subject,
    currentLevel: updates.currentLevel,
    learningGoals: updates.learningGoals,
    weakAreas: updates.weakAreas,
  };

  const studentUpdates = {};

  if (allowedFields.subject !== undefined) {
    studentUpdates.subject = allowedFields.subject.trim();
  }

  if (allowedFields.currentLevel !== undefined) {
    studentUpdates.current_level = allowedFields.currentLevel;
  }

  if (allowedFields.learningGoals !== undefined) {
    studentUpdates.learning_goals = allowedFields.learningGoals;
  }

  if (allowedFields.weakAreas !== undefined) {
    studentUpdates.weak_areas = allowedFields.weakAreas;
  }

  studentUpdates.updated_at = new Date().toISOString();

  const { data: existingStudent, error: existingStudentError } =
    await supabase
      .from("students")
      .select("id, profile_id")
      .eq("id", studentId)
      .eq("tutor_id", tutorId)
      .single();

  if (existingStudentError) {
    if (existingStudentError.code === "PGRST116") {
      throw new Error("Student not found");
    }

    throw new Error(existingStudentError.message);
  }

  if (allowedFields.fullName !== undefined) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: allowedFields.fullName.trim(),
      })
      .eq("id", existingStudent.profile_id);

    if (profileError) {
      throw new Error(profileError.message);
    }
  }

  const { data: student, error: studentError } = await supabase
    .from("students")
    .update(studentUpdates)
    .eq("id", studentId)
    .eq("tutor_id", tutorId)
    .select(
      `
      id,
      profile_id,
      tutor_id,
      subject,
      current_level,
      learning_goals,
      weak_areas,
      created_at,
      updated_at,
      profiles!students_profile_id_fkey (
        id,
        full_name,
        email
      )
      `
    )
    .single();

  if (studentError) {
    throw new Error(studentError.message);
  }

  return student;
};

const deleteStudent = async (studentId, tutorId) => {
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id, profile_id")
    .eq("id", studentId)
    .eq("tutor_id", tutorId)
    .single();

  if (studentError) {
    if (studentError.code === "PGRST116") {
      throw new Error("Student not found");
    }

    throw new Error(studentError.message);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", student.profile_id);

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    message: "Student deleted successfully",
  };
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};