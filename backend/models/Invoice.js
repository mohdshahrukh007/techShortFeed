const mongoose = require('mongoose');

// Sub-schema for items within an invoice
const itemSubSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    quantity: { type: Number, required: true },
    days: { type: Number, required: true },
    total: { type: Number, required: true }
}, { _id: false }); // Using _id: false to prevent Mongoose from creating an _id for each item
const invoiceSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  id: {
    type: String,
    required: true,
    default: () => `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  },
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  items: [itemSubSchema],
  grandTotal: { type: Number, required: true },
  advance: { type: Number, default: 0 },
  netTotal: { type: Number, required: true },
}, { timestamps: true });
// Ensure that the combination of a custom 'id' and 'userId' is unique
invoiceSchema.index({ id: 1, userId: 1 }, { unique: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;