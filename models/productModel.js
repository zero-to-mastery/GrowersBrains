const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  pictures: [String],
  articles: [String], //?Array of links
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
