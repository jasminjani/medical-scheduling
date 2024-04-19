const express = require('express');
const { createSlots, getSingleSlots, bookingSlot, getAllSlots, deleteSlot, cancelSlot, createSlotsPage, getSlotsPage, getDates, getBookSlotPage, getBookingSlots, DoctorCobmo } = require('../controllers/slotController');
const { rating } = require('../controllers/ratingController');
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });

const { createUser, login, getAllUser, logout, getUserById, deleteUser, generateToken, createUserForm, getCreateUserForm, getLoginForm, activationForm, activationAccount, getCurrentUser, homePage } = require("../controllers/userController");
const passport = require('passport');
const { patientPayments, patientProfile, patientUpcomingBookings, patientPastBookings } = require('../controllers/patientAllAppointController');
const { paymentHistory } = require('../controllers/doctorPaymentHistory');

router.route("/")
.get(homePage)

router.route('/register')
.get(getCreateUserForm)
.post(imgUpload.single('profile'), createUser)

router.route('/users')
.get(passport.authenticate('jwt', { session: false }), getAllUser)

router.route('/login')
.get(getLoginForm)
.post(login)

router.route('/current-user')
.get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),getCurrentUser)

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
router.route("/addSlot").get(createSlotsPage);
router.route("/slot/:doctor_id").post(createSlots)

router.route("/slot").get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),getBookingSlots);

router.route('/getDoctors').post(DoctorCobmo)
router.route("/slots").post(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),getSingleSlots);
router.route("/bookslot").post(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}), bookingSlot);
router.route("/upcomingSlots").get(getSlotsPage);
router.route("/dates/:doctor_id").get(getDates);
router.route("/slots/:doctor_id/:date").get(getAllSlots);
router.route("/:doctor_id/delete/:slot_id").get(deleteSlot);
router.route("/:patient_id/cancel/:slot_id").put(cancelSlot)

// Patients panel details(patientAllControllers)
router.route("/patientUpcomingSlots").get(patientProfile);
router.route("/bookings/:patient_id").get(patientUpcomingBookings);
router.route("/pastbookings/:patient_id").get(patientPastBookings);
router.route("/payments/:patient_id").get(patientPayments) 
router.route("/patient-paymentHistory").get(paymentHistory)

module.exports = router;
