const express = require('express')
const router = express.Router()

// import Controller File
const { allDoctor, createDoctor, doctorDisplay, updatePutDoctorDetails, getDoctorReview, doctorData, updateGetDoctorData, updateGetDoctorDisplay } = require('../controllers/doctorController');

router.route("/doctorProfile")
.get(allDoctor)



router.route("/doctorCreateProfile")
.post(createDoctor)


  router.route("/reviews/:doctor_id")
  .get(getDoctorReview)
  
  router.route("/updatedoctorProfile/:id")
    .post(updatePutDoctorDetails)



  // Router show json format Data date:- 12-04-2024
  router.route("/doctorData/:id")
  .get(doctorData)

  router.route("/updateDoctorData/:id")
    .get(updateGetDoctorData)

// Router show doctor details date:- 12-04-2024
router.route("/doctorProfile/:id")
  .get(doctorDisplay)


router.route("/updatedoctorProfile/:id")
  .get(updateGetDoctorDisplay)


router.route("") 
  
  module.exports = router