const router = require('express').Router();
const { createHospital } = require('../controllers/createHospital');

router.route('/createHospital').post(createHospital);

module.exports = router;