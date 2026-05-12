const mongoose = require("mongoose");
require("dotenv").config();

const Admin = require("./models/Admin");

const seedAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error("MONGO_URI tanımlı değil. .env dosyanızı kontrol edin.");
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log("MongoDB bağlantısı başarılı.");

        const username = process.env.DEFAULT_ADMIN_USERNAME;
        const password = process.env.DEFAULT_ADMIN_PASSWORD;

        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
            console.log("Admin zaten mevcut.");
            process.exit(0);
        }

        await Admin.create({
            username,
            password,
        });

        console.log("✓ Admin başarıyla oluşturuldu.");
        console.log(`Kullanıcı adı: ${username}`);
        console.log(`Şifre: ${password}`);
        console.log("(Lütfen ilk girişte şifrenizi değiştiriniz!)");

        process.exit(0);
    } catch (error) {
        console.error("Seed işlemi başarısız:", error.message);
        process.exit(1);
    }
};

seedAdmin();
