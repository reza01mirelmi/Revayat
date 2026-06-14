import app from "./app";
import "dotenv/config";
import { connectDB, disconnectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

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
process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});

startServer();
