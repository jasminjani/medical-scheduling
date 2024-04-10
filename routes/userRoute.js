<<<<<<< HEAD
const express = require('express');
const { allUser } = require('../controllers/userController');
const { createSlots } = require('../controllers/slotController');
=======
const express = require("express");
const { allUser } = require("../controllers/userController");
>>>>>>> develop
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });

router.route("/user")
<<<<<<< HEAD
  .get(allUser);
router.route("/slot/:doctor_id").post(createSlots)

=======
.get(allUser);
>>>>>>> develop

module.exports = router;
