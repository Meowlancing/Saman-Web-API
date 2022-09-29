const express = require('express');
const router = express.Router();

const sellerAuth = require('../../middlewares/seller-secure');
const sellerLogin = require('../../controllers/seller/login')

module.exports = router;