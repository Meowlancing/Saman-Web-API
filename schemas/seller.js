const mongoose = require('mongoose');
require('dotenv').config('../.env');

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        min: 10,
        max: 10
    },
    address: {
        type: String,
        required: true
    },
    aadhaar_number: {
        type: String,
        required: true
    },
    owner_picture: {
        type: String,
        required: true
    },
    shop_name: {
        type: String,
        required: true
    },
    shop_address: {
        type: String,
        required: true
    },
    shop_picture: {
        type: String,
        required: true
    },
    products: {
        type: mongoose.Schema.Types.ObjectId
    }
}, {
    versionKey: false,
    timestamps: true
});

exports.sellerModel = mongoose.model('Seller', sellerSchema, 'sellers');