const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    pricePerDay: { type: Number, required: true }
}, { timestamps: true });

// Ensure item names are unique per user
itemSchema.index({ name: 1, userId: 1 }, { unique: true });

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;