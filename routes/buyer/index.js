const express = require('express');
const router = express.Router();

const sellerAuth = require('../../middlewares/seller-secure');
const sellerLogin = require('../../controllers/seller/login');
const sellerRegister = require('../../controllers/seller/register');
const sellerShop = require('../../controllers/seller/shop');
const sellerProfile = require('../../controllers/seller/profile');
const sellerProducts = require('../../controllers/seller/listing');
const sellerOrder = require('../../controllers/seller/order');

router.route('/login')
    .post(sellerLogin.userLoginHandler);

router.route('/logout')
    .post(sellerLogin.userLogoutHandler);

router.route('/register')
    .post(sellerRegister.registrationHandler);

router.route('/deregister')
    .post(sellerAuth.authorisationHandler, sellerRegister.deregistrationHandler);

router.route('/store')
    .get(sellerShop.getShopHandler);

router.route('/orders')
    .get(sellerOrder.getOrdersHandler)

router.route('/profile')
    .get(sellerProfile.getUserProfileHandler)
    .post(sellerProfile.postUserProfiletHandler);

router.route('/products')
    .get(sellerProducts.getProductsHandler)
    .post(sellerProducts.postProductsHandler)

module.exports = router;