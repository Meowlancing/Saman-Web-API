const mongoose = require('mongoose');
require('dotenv').config('../.env');

const productSchema = new mongoose.Schema({
    is_shipped_online: Boolean,
    is_out_of_stock: Boolean,
    seller_id: String,
    title: String,
    images: [String],
    categories: String,
    description: String,
    rating: { 
        type: Number,
        default: null
    }
}, {
    versionKey: false,
    timestamps: true
});

exports.productModel = mongoose.model('Product', productSchema, 'products');