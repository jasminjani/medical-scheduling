const express = require("express");
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });
const { allUser, createUser } = require("../controllers/userController");
const { createSlots } = require("../controllers/slotController");


router.route("/user").post(createUser);
router.route("/slot/:doctor_id").post(createSlots);

module.exports = router;
