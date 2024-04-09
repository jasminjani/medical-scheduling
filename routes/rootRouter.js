const express = require('express');
const router1 = require('./paymentsRouter');
const router = express.Router();

router.use('/user', router1);

module.exports = router;