const express = require('express');
const { paymentsController } = require('../controllers/paymentsController');
const router = express.Router();

router.route('/payments').post(paymentsController);

module.exports = router;