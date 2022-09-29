const { orderModel } = require('../../schemas/order');
require('dotenv').config();

exports.getOrdersHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        const orders = await orderModel.find({ seller_id: req.USEROBJ._id });
        res.status(200).json({
            success: true,
            message: 'All good',
            payload: orders
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e : 'An error was encountered, check your request and try again'
        });
    }
};
