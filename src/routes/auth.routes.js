const express = require("express");
const rateLimit = require("express-rate-limit");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  loginAdmin,
  changePassword,
} = require("../controllers/auth.controller");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    success: false,
    message: "Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin.",
  },
});

router.post("/login", loginLimiter, asyncHandler(loginAdmin));
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin,
  });
});
router.put("/change-password", protect, asyncHandler(changePassword));

module.exports = router;
