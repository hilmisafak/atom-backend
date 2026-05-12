const requiredEnv = [
  "PORT",
  "NODE_ENV",
  "CLIENT_URL",
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `Eksik çevresel değişkenler: ${missing.join(", ")}. Lütfen .env dosyanızı kontrol edin.`
    );
    process.exit(1);
  }
};

module.exports = validateEnv;
