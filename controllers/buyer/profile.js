const { rtokenModel } = require('../../schemas/rtoken');
const { buyerModel } = require("../../schemas/buyer");
const { decrypt } = require("../../utils/rsa_4096");
const { sha256_hex } = require("../../utils/sha256");
require('dotenv').config();

exports.getUserProfileHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        res.status(200).json({
            success: true,
            message: 'GET acknowledged',
            payload: {
                name: req.USEROBJ.name,
                email: req.USEROBJ.email,
                phone: req.USEROBJ.phone,
                address: req.USEROBJ.address
            }
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};


exports.postUserProfiletHandler = async (req, res) => {
    try {
        const userObj = await buyerModel.findOne({ _id: req.USEROBJ._id });
        userObj.name = req.body.name;
        userObj.phone = req.body.phone;
        userObj.address = req.body.address;
        await userObj.save();

        res.status(200).json({
            success: true,
            message: 'Updated'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};


exports.postUserCredentialHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        const userObj = await buyerModel.findOne({ email: req.USEROBJ.email });

        if (sha256_hex(decrypt(req.body.password)) !== userObj.password) {
            res.status(401).json({
                success: false,
                message: 'User credentials invalid'
            });
        } else {
            userObj.email =
                Boolean(req.body.new_email) ?
                    req.body.new_email : userObj.email;

            userObj.password =
                Boolean(req.body.new_password) ?
                    sha256_hex(decrypt(req.body.new_password)) : userObj.password;

            await userObj.save();

            await rtokenModel.deleteMany({
                email: req.body.email,
                utype: 'buyer'
            });

            return res.status(200).json({
                success: true,
                message: "Credentials updated: Logged Out",
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};