const { productModel } = require("../../../schemas/product");
const { rtokenModel } = require("../../schemas/rtoken");
const { userModel } = require("../../schemas/seller");
const { decrypt } = require("../../utils/rsa_4096");
const { sha256_hex } = require("../../utils/sha256");
require('dotenv').config();

exports.selleriseHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');
        
        if (!!(await userModel.findOne({ email: req.body.email, is_seller: true }))) {
            return res.status(400).json({
                success: false,
                message: 'User already registered as seller'
            });
        }

        await userModel.findByIdAndUpdate(req.USEROBJ._id, {
            is_seller: true,
            aadhaar_number: req.body.aadhaar_number,
            owner_picture: req.body.owner_picture,
            shop_name: req.body.shop_name,
            shop_address: req.body.shop_address,
            shop_picture: req.body.shop_picture
        });

        res.status(200).json({
            success: true,
            message: 'Registered as seller'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

exports.deselleriseHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');
        
        if (sha256_hex(decrypt(req.body.password)) !== req.USEROBJ.password)
            return res.status(401).json({
                success: false,
                message: 'User credentials invalid'
            });
        
            await userModel.findByIdAndUpdate(req.USEROBJ._id, {
                is_seller: false,
                aadhaar_number: null,
                owner_picture: null,
                shop_name: null,
                shop_address: null,
                shop_picture: null,
                products: []
            });

            await productModel.deleteMany({ seller_id: req.USEROBJ._id });

        await rtokenModel.deleteMany({
            email: req.USEROBJ.email,
            utype: 'user'
        });
        res.status(200).json({
            success: true,
            message: 'Deregistered'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};