const express = require("express");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const protect = require("../middlewares/auth.middleware");

const {
    uploadPhoto,
    getPhotos,
    deletePhoto,
    updatePhoto,
} = require("../controllers/photo.controller");

router.get("/", asyncHandler(getPhotos));

router.post("/", protect, upload.single("image"), asyncHandler(uploadPhoto));

router.put("/:id", protect, upload.single("image"), asyncHandler(updatePhoto));

router.delete("/:id", protect, asyncHandler(deletePhoto));

module.exports = router;