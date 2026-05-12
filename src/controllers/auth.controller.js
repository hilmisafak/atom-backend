const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı adı ve şifre zorunludur.",
      });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı adı veya şifre hatalı.",
      });
    }

    const isPasswordCorrect = await admin.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Kullanıcı adı veya şifre hatalı.",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Giriş başarılı.",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Giriş işlemi başarısız.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Eski şifre ve yeni şifre zorunludur.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Yeni şifre en az 8 karakter olmalıdır.",
      });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin bulunamadı.",
      });
    }

    const isPasswordCorrect = await admin.comparePassword(oldPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Eski şifre hatalı.",
      });
    }

    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Şifre başarıyla değiştirildi.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Şifre değiştirme işlemi başarısız.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};

module.exports = {
  loginAdmin,
  changePassword,
};
