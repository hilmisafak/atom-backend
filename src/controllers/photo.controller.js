const Photo = require("../models/Photo");
const cloudinary = require("../config/cloudinary");

const uploadPhoto = async (req, res) => {
  try {
    const { title, description = "", category } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Başlık gerekli.",
      });
    }

    if (!category || category.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Kategori gerekli.",
      });
    }

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
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
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
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

const getPhotos = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const filters = {};

    if (category) {
      filters.category = category.trim();
    }

    if (search) {
      filters.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 50);

    const total = await Photo.countDocuments(filters);
    const photos = await Photo.find(filters)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      count: photos.length,
      total,
      page: pageNumber,
      limit: pageSize,
      data: photos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Fotoğraflar alınamadı.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
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
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
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

    if (title !== undefined && title !== null) {
      if (title.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Başlık boş olamaz.",
        });
      }
      photo.title = title.trim();
    }

    if (category !== undefined && category !== null) {
      if (category.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Kategori boş olamaz.",
        });
      }
      photo.category = category.trim();
    }

    photo.description = description !== undefined ? description.trim() : photo.description;

    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "atom-oto/gallery",
        resource_type: "image",
      });

      await cloudinary.uploader.destroy(photo.publicId);

      photo.imageUrl = result.secure_url;
      photo.publicId = result.public_id;
    }

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
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

module.exports = {
  uploadPhoto,
  getPhotos,
  deletePhoto,
  updatePhoto,
};
