const express = require("express");
const cloudinary = require("../config/cloudinary");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/test", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Fotoğraf yüklenmedi.",
            });
        }

        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "atom-oto/test",
            resource_type: "image",
        });

        return res.status(201).json({
            success: true,
            message: "Fotoğraf Cloudinary'ye yüklendi.",
            data: {
                url: result.secure_url,
                publicId: result.public_id,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cloudinary yükleme hatası.",
            error: error.message,
        });
    }
});

module.exports = router;