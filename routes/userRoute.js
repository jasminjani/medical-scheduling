const express = require('express');
const { allUser } = require('../controllers/userController');
const { rating } = require('../controllers/ratingController');
const router = express.Router();


router.route("/user").get(allUser)

router.route("/:patient_id/review/:doctor_id").post(rating)


module.exports = router;