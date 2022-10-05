const { userModel } = require('../../../schemas/user');
const { productModel } = require('../../../schemas/product');
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

exports.postProductHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        if (!req.query.id) {
            const newProduct = new productModel(req.body);
            await newProduct.save();
            
            await userModel.findByIdAndUpdate(req.USEROBJ._id, {
                $push: { products: newProduct }
            });

            return res.status(200).json({
                success: true,
                message: 'New product added'
            });
        }

        await productModel.findOneAndUpdate({ _id: req.query.id }, {
            is_shipped_online: req.body.is_shipped_online,
            is_out_of_stock: req.body.is_out_of_stock,
            seller_id: req.body.seller_id,
            title: req.body.title,
            images: req.body.images,
            categories: req.body.categories,
            description: req.body.description
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

exports.deleteProductHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        if (!req.query.id) {
            return res.status(200).json({
                success: false,
                message: 'Product `id` query missing'
            });
        }

        await productModel.findByIdAndRemove(req.query.id);
        await userModel.findByIdAndUpdate(req.USEROBJ._id, {
            $pull: { products: req.query.id }
        });

        res.status(200).json({
            success: true,
            message: 'Product deleted'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
}