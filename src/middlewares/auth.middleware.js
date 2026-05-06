const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
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

        req.admin = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Geçersiz veya süresi dolmuş token.",
        });
    }
};

module.exports = protect;