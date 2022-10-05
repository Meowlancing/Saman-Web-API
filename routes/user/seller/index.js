const express = require('express');
const { getProductsHandler, postProductHandler, deleteProductHandler } = require('../../../controllers/user/seller/products');
const { selleriseHandler, deselleriseHandler } = require('../../../controllers/user/seller/sellerise');
const { getShopHandler } = require('../../../controllers/user/seller/shopsite');
const { getOrdersHandler } = require('../../../controllers/user/seller/todo');
const { authorisationHandler } = require('../../../middlewares/user-secure');
const router = express.Router();

router.route('/register')
    .post(authorisationHandler, selleriseHandler);

router.route('/deregister')
    .post(authorisationHandler, deselleriseHandler);

router.route('/shopsite')
    .post(authorisationHandler, getShopHandler);

router.route('/orders')
    .get(authorisationHandler, getOrdersHandler);

router.route('/products')
    .get(authorisationHandler, getProductsHandler)
    .post(authorisationHandler, postProductHandler)
    .delete(authorisationHandler, deleteProductHandler);

module.exports = router;