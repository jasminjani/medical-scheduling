const express = require('express');
const { allUser } = require('../controllers/userController');
const { createSlots } = require('../controllers/slotController');
const router = express.Router();


router.route("/user")
  .get(allUser);
router.route("/slot/:doctor_id").post(createSlots)


module.exports = router;