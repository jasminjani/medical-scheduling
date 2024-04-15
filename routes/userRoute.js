const express = require('express');
const { createSlots, getSingleSlots, bookingSlot, getAllSlots, deleteSlot, cancelSlot, createSlotsPage, getSlotsPage, getDates } = require('../controllers/slotController');
const { rating } = require('../controllers/ratingController');
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });

const { createUser, login, getAllUser, logout, getUserById, deleteUser, generateToken, createUserForm, getCreateUserForm, getLoginForm, activationForm, activationAccount, getCurrentUser } = require("../controllers/userController");
const passport = require('passport');

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

// Slots controller
router.route("/addSlot").get(createSlotsPage);
router.route("/slot/:doctor_id").post(createSlots)
router.route("/slot/:doctor_id/:date").get(getSingleSlots);
router.route("/:patient_id/book/:slot_id").post(bookingSlot);
router.route("/upcomingSlots").get(getSlotsPage);
router.route("/dates/:doctor_id").get(getDates);
router.route("/slots/:doctor_id/:date").get(getAllSlots);
router.route("/:doctor_id/delete/:slot_id").get(deleteSlot);
router.route("/:patient_id/cancel/:slot_id").put(cancelSlot)

module.exports = router;
