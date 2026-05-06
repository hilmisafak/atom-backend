const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
    loginAdmin,
    changePassword,
} = require("../controllers/auth.controller");

router.post("/login", loginAdmin);

router.put("/change-password", protect, changePassword);

module.exports = router;