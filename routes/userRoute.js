
const express = require('express');

const router = express.Router();
const { createSlots } = require('../controllers/slotController');
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });
const { allUser, createUser } = require("../controllers/userController");
const { createSlots } = require("../controllers/slotController");


router.route("/:patient_id/review/:doctor_id").post(rating)
router.route("/user").get(allUser);
router.route("/slot/:doctor_id").post(createSlots)

module.exports = router;
