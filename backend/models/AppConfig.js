const mongoose = require('mongoose');

const appConfigSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "Bharat Store" },
    address: { type: String },
    phone: { type: String },
    themeColor: { type: String, default: "#667eea" },
    language: { type: String, default: "en" }
}, { timestamps: true });

const AppConfig = mongoose.model("AppConfig", appConfigSchema);

module.exports = AppConfig;