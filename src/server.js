require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const validateEnv = require("./config/validateEnv");

validateEnv();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on("unhandledRejection", (error) => {
      console.error("Unhandled Rejection:", error);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Başlatma hatası:", error);
    process.exit(1);
  }
};

startServer();

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
