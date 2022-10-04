const mongoose = require('mongoose');
require('dotenv').config('../.env');

/** 
 *  OrderSchema must be received in the following format from the front-end for the API middlewares
 *  to produce the final form expected by mongoose validation further below:
 *   {
 *       customer_id: mongoose.Schema.Types.ObjectId,
 *       customer_address: String,
 *       products: [{ product_id: mongoose.Schema.Types.ObjectId, seller_id: mongoose.Schema.Types.ObjectId, quantity: Number }]
 *   }
 */

const orderSchema = new mongoose.Schema({
    customer_id: mongoose.Schema.Types.ObjectId,
    customer_name: String,
    customer_address: String,
    customer_phone: String,
    customer_email: String,
    seller_id: mongoose.Schema.Types.ObjectId,
    products: [{
        product_id: mongoose.Schema.Types.ObjectId,
        quantity: Number
    }],
    is_delivered: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

exports.orderModel = mongoose.model('Order', orderSchema, 'orders');