const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  category: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
