const { productModel } = require('../../schemas/product');
require('dotenv').config();

exports.getProductsHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        const products = await productModel.find({ seller_id: req.USEROBJ._id });
        res.status(200).json({
            success: true,
            message: 'All good',
            payload: products
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e : 'An error was encountered, check your request and try again'
        });
    }
};

exports.postProductsHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        if (!req.query.id) {
            const newProduct = new productModel(req.body);
            await newProduct.save();
            return res.status(200).json({
                success: true,
                message: 'New product added'
            });
        }

        const userObj = await buyerModel.findOneAndUpdate({ _id: req.USEROBJ._id }, {
            seller_id: req.body.seller_id,
            title: req.body.title,
            images: req.body.images,
            categories: req.body.categories,
            description: req.body.description,
            rating: req.body.rating
        });

        res.status(200).json({
            success: true,
            message: 'Product updated'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};