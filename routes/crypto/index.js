const express = require('express');
const router = express.Router();

// exposed public key
router.use('/pubkey', require('../../controllers/rsa_4096/public-key').exportPublicKey);

module.exports = router;