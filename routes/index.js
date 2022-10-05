const express = require('express');
const router = express.Router();

// routes for the buyer
router.use('/user', require('./user/index'));

// exposed public key
router.use('/crypto', require('./crypto/index'));

module.exports = router;