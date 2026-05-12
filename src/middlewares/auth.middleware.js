const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.toLowerCase().startsWith("bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Yetkisiz erişim. Token bulunamadı.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.admin = {
            id: decoded.id,
            username: decoded.username,
        };

        next();
    } catch (error) {
        const message = error.name === "TokenExpiredError"
            ? "Token süresi doldu. Lütfen tekrar giriş yapın."
            : "Geçersiz token.";

        return res.status(401).json({
            success: false,
            message,
        });
    }
};

module.exports = protect;