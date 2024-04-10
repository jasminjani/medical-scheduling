
const express = require('express');

const { createSlots, getSingleSlots, bookingSlot, getAllSlots } = require('../controllers/slotController');

const { rating } = require('../controllers/ratingController');
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });
const { allUser, createUser } = require("../controllers/userController");

router.route("/:patient_id/review/:doctor_id").post(rating);

router.route("/slot/:doctor_id").post(createSlots)
router.route("/slot/:doctor_id/:date").get(getSingleSlots);
router.route("/:patient_id/book/:slot_id").post(bookingSlot);
router.route("/slots/:doctor_id").get(getAllSlots);

module.exports = router;
