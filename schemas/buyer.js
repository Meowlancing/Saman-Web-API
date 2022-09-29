const mongoose = require('mongoose');
require('dotenv').config('../.env');

const buyerSchema = new mongoose.Schema({
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
        type: String
    },
    cart: [{
        product_id: mongoose.Schema.Types.ObjectId,
        seller_id: mongoose.Schema.Types.ObjectId,
        quantity: { 
            type: Number,
            min: 1
        }
    }]
}, {
    versionKey: false,
    timestamps: true
});

exports.buyerModel = mongoose.model('Buyer', buyerSchema, 'buyers');