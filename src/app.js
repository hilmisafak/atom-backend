const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const photoRoutes = require("./routes/photo.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        success: false,
        message: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
    },
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        message: "ATOM OTO Backend API Running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);

app.use((req, res, next) => {
  const error = new Error("Endpoint bulunamadı.");
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;