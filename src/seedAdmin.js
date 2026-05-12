const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB bağlantısı başarılı.");

        // Mevcut admin var mı kontrol et
        const existingAdmin = await Admin.findOne({ username: "admin" });

        if (existingAdmin) {
            console.log("Admin zaten mevcut.");
            process.exit(0);
        }

        // Şifreyi hash'le
        const hashedPassword = await bcryptjs.hash("admin123", 10);

        // Yeni admin oluştur
        await Admin.create({
            username: "admin",
            password: hashedPassword,
        });

        console.log("✓ Admin başarıyla oluşturuldu.");
        console.log("Kullanıcı adı: admin");
        console.log("Şifre: admin123");
        console.log("(Lütfen ilk girişte şifrenizi değiştiriniz!)");

        process.exit(0);
    } catch (error) {
        console.error("Seed işlemi başarısız:", error.message);
        process.exit(1);
    }
};

seedAdmin();
