const Photo = require("../models/Photo");
const cloudinary = require("../config/cloudinary");

const uploadPhoto = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Fotoğraf gerekli.",
            });
        }

        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "atom-oto/gallery",
            resource_type: "image",
        });

        const photo = await Photo.create({
            title,
            description,
            category,
            imageUrl: result.secure_url,
            publicId: result.public_id,
        });

        return res.status(201).json({
            success: true,
            message: "Fotoğraf başarıyla kaydedildi.",
            data: photo,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Fotoğraf yükleme başarısız.",
            error: error.message,
        });
    }
};

const getPhotos = async (req, res) => {
    try {
        const photos = await Photo.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: photos.length,
            data: photos,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Fotoğraflar alınamadı.",
        });
    }
};

const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        const photo = await Photo.findById(id);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Fotoğraf bulunamadı.",
            });
        }

        await cloudinary.uploader.destroy(photo.publicId);

        await photo.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Fotoğraf silindi.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Silme işlemi başarısız.",
        });
    }
};

const updatePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category } = req.body;

        const photo = await Photo.findById(id);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Fotoğraf bulunamadı.",
            });
        }

        photo.title = title ?? photo.title;
        photo.description = description ?? photo.description;
        photo.category = category ?? photo.category;

        const updatedPhoto = await photo.save();

        return res.status(200).json({
            success: true,
            message: "Fotoğraf bilgileri güncellendi.",
            data: updatedPhoto,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Fotoğraf güncelleme başarısız.",
            error: error.message,
        });
    }
};

module.exports = {
    uploadPhoto,
    getPhotos,
    deletePhoto,
    updatePhoto,
};