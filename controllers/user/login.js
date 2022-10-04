const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { decrypt } = require('../../utils/rsa_4096');
const { userModel } = require('../../schemas/buyer');
const { rtokenModel } = require('../../schemas/rtoken');
const { sha256_hex } = require('../../utils/sha256');
require('dotenv').config();

/* Function to verify user login password and for generating access tokens */
exports.userLoginHandler = async (req, res) => {
    try {
        const userObj = await userModel.findOne({ email: req.body.email });

        if (userObj == null)
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });

        if (sha256_hex(decrypt(req.body.password)) !== userObj.password)
            return res.status(401).json({
                success: false,
                message: 'User credentials invalid'
            });

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
                email: req.body.email,
                utype: 'user'
            },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Authorised",
            jwt: token,
            jwt_refresh: token_refresh
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

/* Function to obliterate refresh jwts of users logging out */
exports.userLogoutHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, async (err, userObj) => {
            if (err)
                res.status(400).json({
                    success: false,
                    message: process.env.DEBUG_MODE? err.message : 'An error was encountered, check your request and try again'
                });
            
            await rtokenModel.deleteMany({ 
                email: userObj.email, 
                utype: 'user'
            });

            res.status(200).json({
                success: true,
                message: 'Logged out'
            });
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};