require("dotenv").config();

const app = require("./app");
const supabase = require("./config/supabase");

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    const { error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      throw error;
    }

    console.log("Supabase database connected");

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Supabase connection failed");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();