const multer = require("multer");

const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Sunucu hatası.";

    if (err instanceof multer.MulterError) {
        statusCode = 400;
        message = err.message;
    }

    if (err.name === "SyntaxError" && err.status === 400 && "body" in err) {
        statusCode = 400;
        message = "Geçersiz JSON. Lütfen isteğinizi kontrol edin.";
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};

module.exports = errorHandler;