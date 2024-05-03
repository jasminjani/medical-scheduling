const { nearByDoctores, nearByDoctoresOnSearch } = require('../controllers/patientController');
const passport = require('passport');
const { isPatient } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.route("/getNearByDoctor").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), isPatient, nearByDoctores);
router.route('/searchCity').get(nearByDoctoresOnSearch);

module.exports = router;

