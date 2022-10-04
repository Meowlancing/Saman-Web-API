const express = require('express');
const router = express.Router();

const userAuth = require('../../middlewares/user-secure');
const userLogin = require('../../controllers/user/login');
const userRegister = require('../../controllers/user/register');
const userProfile = require('../../controllers/user/profile');
const userProducts = require('../../controllers/user/listing');
const userOrder = require('../../controllers/user/order');
const sellerRoutes = require('./seller/index.js')

router.route('/login')
    .post(userLogin.userLoginHandler);

router.route('/logout')
    .post(userLogin.userLogoutHandler);

router.route('/register')
    .post(userRegister.registrationHandler);

router.route('/deregister')
    .post(userAuth.authorisationHandler, userRegister.deregistrationHandler);

router.use('/seller', sellerRoutes); // one level deeper

router.route('/orders')
    .get(userOrder.getOrdersHandler)

router.route('/profile')
    .get(userProfile.getUserProfileHandler)
    .post(userProfile.postUserProfiletHandler);

router.route('/products')
    .get(userProducts.getProductsHandler)
    .post(userProducts.postProductsHandler)

module.exports = router;