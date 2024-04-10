const { nearByDoctores, nearByDoctoresOnSearch } = require('../controllers/nearByDoctorsController');

const router = require('express').Router();

router.route('/searchDoctor').get(nearByDoctores);
router.route('/searchCity').get(nearByDoctoresOnSearch);

module.exports = router;

