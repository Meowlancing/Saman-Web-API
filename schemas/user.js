const mongoose = require('mongoose');
require('dotenv').config('../.env');

const userSchema = new mongoose.Schema({
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
    cart: [{
        product_id: mongoose.Schema.Types.ObjectId,
        user_id: mongoose.Schema.Types.ObjectId,
        quantity: { 
            type: Number,
            min: 1
        }
    }],

    // -------------------- seller section starts here -------------------- //

    is_seller: { 
        type: Boolean,
        default: false,
    },
    aadhaar_number: {
        type: String,
        default: null
    },
    owner_picture: {
        type: String,
        default: null
    },
    shop_name: {
        type: String,
        default: null
    },
    shop_address: {
        type: String,
        default: null
    },
    shop_picture: {
        type: String,
        default: null
    },
    products: [mongoose.Schema.Types.ObjectId]

    // --------------------- seller section ends here --------------------- //

}, {
    versionKey: false,
    timestamps: true
});

exports.userModel = mongoose.model('User', userSchema, 'users');