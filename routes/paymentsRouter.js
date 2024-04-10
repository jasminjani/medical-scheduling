const express = require('express');
const { paymentsController } = require('../controllers/paymentsController');
const router1 = express.Router();

router1.route('/payments').post(paymentsController);

module.exports = router1;