
const express = require('express');
const { allUser } = require('../controllers/userController');
const { rating } = require('../controllers/ratingController');
const router = express.Router();
const { createSlots } = require('../controllers/slotController');
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });


router.route("/:patient_id/review/:doctor_id").post(rating)
router.route("/user").get(allUser);
router.route("/slot/:doctor_id").post(createSlots)



module.exports = router;
