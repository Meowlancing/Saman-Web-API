const { rtokenModel } = require('../../schemas/rtoken');
const { userModel } = require("../../schemas/buyer");
const { decrypt } = require("../../utils/rsa_4096");
const { sha256_hex } = require("../../utils/sha256");
require('dotenv').config();

exports.getUserProfileHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        var payload = {
            name: req.USEROBJ.name,
            email: req.USEROBJ.email,
            phone: req.USEROBJ.phone,
            address: req.USEROBJ.address
        };

        if (req.USEROBJ.is_seller) {
            payload.aadhaar_number = req.USEROBJ.aadhaar_number;
            payload.owner_picture = req.USEROBJ.owner_picture;
            payload.shop_name = req.USEROBJ.shop_name;
            payload.shop_address = req.USEROBJ.shop_address;
            payload.shop_picture = req.USEROBJ.shop_picture;
        }
        
        res.status(200).json({
            success: true,
            message: 'GET acknowledged',
            payload: payload
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
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');


            var updatedUserObj = {
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address
            };
            
            if (req.USEROBJ.is_seller) {
                updatedUserObj.aadhaar_number = req.body.aadhaar_number;
                updatedUserObj.owner_picture = req.body.owner_picture;
                updatedUserObj.shop_name = req.body.shop_name;
                updatedUserObj.shop_address = req.body.shop_address;
                updatedUserObj.shop_picture = req.body.shop_picture;
            }
            
        await userModel.findOneAndUpdate({ _id: req.USEROBJ._id }, updatedUserObj);

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

        const userObj = await userModel.findOne({ email: req.USEROBJ.email });

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

            const token = jwt.sign({
                    _id: userObj._id,
                    email: userObj.email
                },
                process.env.JWT_SECRET
                /* { expiresIn: parseInt(process.env.JWT_EXP) } */
            );

            const token_refresh = jwt.sign({
                    _id: userObj._id,
                    email: userObj.email,
                    salt: crypto.randomBytes(32).toString('hex')
                },
                process.env.JWT_SECRET
            );

            await rtokenModel.findOneAndUpdate(
                { email: req.body.email },
                {
                    rtoken: token_refresh, 
                    email: userObj.email,
                    utype: 'user'
                },
                { upsert: true }
            );

            return res.status(200).json({
                success: true,
                message: "Credentials updated",
                jwt: token,
                jwt_refresh: token_refresh
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};