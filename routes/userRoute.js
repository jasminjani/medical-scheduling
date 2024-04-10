const express = require('express');
const { createSlots, getSlots } = require('../controllers/slotController');
const { rating } = require('../controllers/ratingController');
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });
const { createUser, login, getAllUser, logout, getUserById, deleteUser, generateToken } = require("../controllers/userController");
const passport = require('passport');

router.route('/register').post(imgUpload.single('profile'),createUser)
router.route('/users').get(passport.authenticate('jwt',{session:false}),getAllUser)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/user/:id').post(getUserById)
router.route('/user/:id').delete(deleteUser)
router.route('/generateToken').post(generateToken)





router.route("/:patient_id/review/:doctor_id").post(rating);

router.route("/slot/:doctor_id").post(createSlots)
router.route("/slot/:doctor_id/:date").get(getSlots);

module.exports = router;
