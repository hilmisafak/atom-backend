const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const protect = require("../middlewares/auth.middleware");

const {
    uploadPhoto,
    getPhotos,
    deletePhoto,
    updatePhoto,
} = require("../controllers/photo.controller");

router.get("/", getPhotos);

router.post("/", protect, upload.single("image"), uploadPhoto);

router.put("/:id", protect, updatePhoto);

router.delete("/:id", protect, deletePhoto);

module.exports = router;