const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const supabase = require("../config/supabase");

const ALLOWED_ROLES = ["tutor", "student"];

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const signup = async ({ fullName, email, password, role }) => {
  if (!ALLOWED_ROLES.includes(role)) {
    throw new Error("Invalid role");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const { data: existingUser, error: existingUserError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", normalizedEmail)
    .eq("role", role)
    .maybeSingle();

  if (existingUserError) {
    throw new Error(existingUserError.message);
  }

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const userId = randomUUID();

  const { data: user, error: createUserError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      full_name: fullName.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      role,
    })
    .select("id, full_name, email, role, created_at")
    .single();

  if (createUserError) {
    throw new Error(createUserError.message);
  }

  const token = generateToken(user);

  return {
    user,
    token,
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, password_hash, role, created_at"
    )
    .eq("email", normalizedEmail)
    .eq("role", role)
    .maybeSingle();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  delete user.password_hash;

  return {
    user,
    token,
  };
};

module.exports = {
  signup,
  login,
};