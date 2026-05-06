const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            required: true,
        },

        imageUrl: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Photo", photoSchema);