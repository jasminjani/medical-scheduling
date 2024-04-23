const express = require('express');

const { rating } = require('../controllers/ratingController');
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });
const { getBookSlotPage, getBookingSlots, getSlotsPage } = require("../controllers/slotController")
const { createUser, login, getAllUser, logout, getUserById, deleteUser, generateToken, createUserForm, getCreateUserForm, getLoginForm, activationForm, activationAccount, getCurrentUser, homePage, getDoctorDetails, allDoctors, forgotPassword, forgotPassLink, createPasswordForm, updatePassword } = require("../controllers/userController");
const passport = require('passport');


const { patientPayments, patientProfile, patientUpcomingBookings, patientPastBookings, patientPastProfile, searchPatientPayment, patientPanelPaymentHistory } = require('../controllers/patientAllAppointController');


const { isAdmin, isPatient } = require('../middlewares/authMiddleware');



router.route("/")
  .get(homePage)

router.route('/alldoctors').get(getDoctorDetails)

router.route('/register')
  .get(getCreateUserForm)
  .post(imgUpload.single('profile'), createUser)

router.route('/login')
  .get(getLoginForm)
  .post(login)

router.route('/current-user')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getCurrentUser)

router.route('/logout')
  .post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),logout)

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

router.route('/forgot-password')
  .get(forgotPassword)
  .post(forgotPassLink)

router.route('/forgot')
.get(createPasswordForm)

router.route('/forgot/change-password')
.post(updatePassword)


router.route("/:patient_id/review/:doctor_id").post(rating);
router.route("/doctors/all").get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),allDoctors)


// Slots controller(slotControllers)
// doctorroute.js

// Patients panel details(patientAllControllers)
router.route("/patientUpcomingSlots").get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),isPatient,patientProfile);
router.route("/patientPastSlots").get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),isPatient,patientPastProfile);
router.route("/bookings/:patient_id").get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),isPatient,patientUpcomingBookings);
router.route("/pastbookings/:patient_id").get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),isPatient,patientPastBookings);
router.route("/bookslots/:id").get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),getBookingSlots);
router.route('/slots',passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),getSlotsPage)


// Patient panel Payment history routes
router.route("/payments").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), patientPayments)
router.route("/patient-paymentHistory").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), patientPanelPaymentHistory)
router.route("/searchedPatientPayment/:searchedData").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), searchPatientPayment );


module.exports = router;
