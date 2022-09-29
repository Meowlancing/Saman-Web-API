const mongoose = require('mongoose');
require('dotenv').config('../.env');

const productSchema = new mongoose.Schema({
    seller_id: String,
    title: String,
    images: [String],
    categories: String,
    description: String,
    rating: Number
}, {
    versionKey: false,
    timestamps: true
});

exports.productModel = mongoose.model('Product', productSchema, 'products');