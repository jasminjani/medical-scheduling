const express = require('express')
const router = express.Router()

// import Controller File
const { allDoctor, createDoctor, doctorDisplay, updateDoctorDetails } = require('../controllers/doctorController');

router.route("/doctorProfile")
.get(allDoctor)

router.route("/doctorCreateProfile")
.post(createDoctor)

router.route("/doctorProfile/:id")
  .get(doctorDisplay)

router.route("/doctorProfile/:id")
  .put(updateDoctorDetails)

module.exports = router