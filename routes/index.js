const express = require('express');
const router = express.Router();

// routes for the buyer
router.use('/buyer', require('./buyer/index'));

// routes for the seller
router.use('/seller', require('./seller/index'));

// exposed public key
router.use('/crypto', require('./crypto/index'));

module.exports = router;