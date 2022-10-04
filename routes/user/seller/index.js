const express = require('express');
const router = express.Router();

const sellerAuth = require('../../middlewares/seller-secure');
const sellerLogin = require('../../controllers/seller/login');
const sellerRegister = require('../../controllers/seller/register');
const sellerProfile = require('../../controllers/seller/profile');
const sellerShop = require('../../controllers/seller/shop');
const sellerOrder = require('../../controllers/seller/order');

router.route('/register')
    .post(sellerRegister.deregistrationHandler);

router.route('/deregister')
    .post(sellerAuth.authorisationHandler, sellerRegister.deregistrationHandler);

router.route('/login')
    .post(sellerLogin.userLoginHandler);

router.route('/logout')
    .post(sellerAuth.authorisationHandler, sellerLogin.userLogoutHandler);

router.route('/shop')
    .get(sellerShop.getShopHandler);

router.route('/order-history')
    .get(sellerAuth.authorisationHandler, sellerOrder.getOrdersHandler);

router.route('/profile')
    .get(sellerAuth.authorisationHandler, sellerProfile.getUserProfileHandler)
    .post(sellerAuth.authorisationHandler, sellerProfile.postUserProfiletHandler);

router.route('/change-credentials')
    .post(sellerAuth.authorisationHandler, sellerProfile.postUserCredentialHandler);

router.route('/token')
    .post(sellerAuth.refreshAuthorisationHandler);

module.exports = router;