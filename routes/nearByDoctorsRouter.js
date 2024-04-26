const { nearByDoctores, nearByDoctoresOnSearch } = require('../controllers/patientController');
const passport = require('passport');

const router = require('express').Router();

router.route("/getNearByDoctor").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), nearByDoctores);
router.route('/searchCity').get(nearByDoctoresOnSearch);

module.exports = router;

