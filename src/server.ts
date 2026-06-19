import app from "./app";
import "dotenv/config";
import { connectDB, disconnectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

// Connecting to the database
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server :", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received...");
  await disconnectDB();
  console.log("DB disconnected");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received...");
  await disconnectDB();
  process.exit(0);
});

startServer();
