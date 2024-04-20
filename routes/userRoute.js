const express = require('express');

const { rating } = require('../controllers/ratingController');
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });
const { getBookSlotPage } = require("../controllers/slotController")
const { createUser, login, getAllUser, logout, getUserById, deleteUser, generateToken, createUserForm, getCreateUserForm, getLoginForm, activationForm, activationAccount, getCurrentUser, homePage, getDoctorDetails } = require("../controllers/userController");
const passport = require('passport');

const { paymentHistory, patientPayments, patientProfile, patientUpcomingBookings, patientPastBookings, patientPastProfile, searchPatientPayment } = require('../controllers/patientAllAppointController');


router.route("/")
  .get(homePage)

router.route('/alldoctors').get(getDoctorDetails)
router.route('/register')
  .get(getCreateUserForm)
  .post(imgUpload.single('profile'), createUser)

router.route('/users')
  .get(passport.authenticate('jwt', { session: false }), getAllUser)

router.route('/login')
  .get(getLoginForm)
  .post(login)

router.route('/current-user')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getCurrentUser)

router.route('/logout')
  .post(logout)

router.route('/user/:id')
  .post(getUserById)

router.route('/user/:id')
  .delete(deleteUser)

router.route('/generateToken')
  .post(generateToken)

router.route('/account-activation')
  .get(activationForm)

router.route('/activate')
  .get(activationAccount)



router.route("/:patient_id/review/:doctor_id").post(rating);



// Slots controller(slotControllers)
// doctorroute.js

// Patients panel details(patientAllControllers)
router.route("/patientUpcomingSlots").get(patientProfile);
router.route("/patientPastSlots").get(patientPastProfile);
router.route("/bookings/:patient_id").get(patientUpcomingBookings);
router.route("/pastbookings/:patient_id").get(patientPastBookings);


// Patient panel Payment history routes
router.route("/payments").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), patientPayments)
router.route("/patient-paymentHistory").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), paymentHistory)
router.route("/searchedPatientPayment/:searchedData").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), searchPatientPayment);


module.exports = router;
