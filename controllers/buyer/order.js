const jwt = require('jsonwebtoken');
const { orderModel } = require('../../schemas/order');
const { buyerModel } = require('../../schemas/user');
require('dotenv').config();

exports.getOrderHistoryHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        const orderHistory = await orderModel.find({ customer_id: req.USEROBJ._id });
        res.status(200).json({
            success: true,
            message: 'All good',
            payload: orderHistory
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e : 'An error was encountered, check your request and try again'
        });
    }
};

exports.postNewOrderHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        // Important: refer to the documentation in `schemas/order.js`
        const userObj = await buyerModel.findOne({ _id: req.USEROBJ._id });

        const cartItems = userObj.cart;
        const uniqueSellers = ((x) => {
            var acc = [];
            for (var i = 0; i < x.length; i++)
                if (!acc.includes(x[i].seller_id))
                    acc.push(x[i].seller_id);
            return acc;
        })(cartItems);
        
        const segregatedOrderItems = ((x, y) => {
            var acc = [];
            for (var i = 0; i < y.length; i++) {
                var t = [];
                
                for (var j = 0; j < x.length; j++)
                    if (x[j].seller_id === y[i])
                        t.push({product_id: x[j].product_id, quantity: x[j].quantity});
                
                acc.push(t);
            }
            return acc;
        })(cartItems, uniqueSellers);
        
        var z = 0, toInsertArray = [];
        segregatedOrderItems.forEach((subArray) => {
            toInsertArray.push({
                customer_id: req.USEROBJ._id,
                customer_name: req.USEROBJ.name,
                customer_address: req.USEROBJ.address,
                customer_phone: req.USEROBJ.phone,
                customer_email: req.USEROBJ.email,
                seller_id: uniqueSellers[z++],
                products: subArray
            });
        });

        await orderModel.insertMany(toInsertArray);
        await buyerModel.findOneAndUpdate({ _id: req.USEROBJ._id }, { cart: [] });

        res.status(200).json({
            success: true,
            message: 'Order placed'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};