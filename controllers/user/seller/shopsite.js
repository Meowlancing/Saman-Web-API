const { productModel } = require("../../schemas/product");
const { userModel } = require("../../schemas/seller");

exports.getShopHandler = async (req, res) => {
    try {
        const sellerProfile = await userModel.findOne({ _id: req.query.id });
        const sellerProducts = await productModel.findOne({ seller_id: req.query.id });

        return res.status(200).json({
            shop_name: sellerProfile.shop_name,
            seller_name: sellerProfile.name,
            seller_picture: sellerProfile.owner_picture,
            seller_email: sellerProfile.email,
            seller_phone: sellerProfile.phone,
            shop_picture: sellerProfile.shop_picture,
            shop_address: sellerProfile.shop_address,
            products: sellerProducts
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};