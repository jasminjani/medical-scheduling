const express = require('express')
const router = express.Router()

// import Controller File
const { becomeDoctorDetail,doctorReviewData, getPaymentHistory, doctorPaymentData , doctorDashBoard, getCityCombo, getDoctorSideBarDetail,allDoctor, createDoctor, doctorDisplay, updateDoctorDetails, getDoctorReview, doctorData, updateGetDoctorData, updateGetDoctorDisplay } = require('../controllers/doctorController');

router.route("/doctorProfile")
.get(allDoctor)


router.route("/doctorCreateProfile")
.post(createDoctor)


 router.route('/getDoctorReview/:id')
   .get(getDoctorReview)
  
  router.route("/updatedoctorProfile/:id")
    .post(updateDoctorDetails)



  // Router show json format Data date:- 12-04-2024
  router.route("/doctorData/:id")
  .get(doctorData)

  router.route("/cityCombo")
    .get(getCityCombo)

  router.route("/doctorPaymentData/:id")
    .get(doctorPaymentData)  


  router.route("/updateDoctorData/:id")
    .get(updateGetDoctorData)

router.route("/reviews/:id")
  .get(doctorReviewData)  



// Router show doctor details date:- 12-04-2024
router.route("/doctorProfile/:id")
  .get(doctorDisplay)


router.route("/doctorCreateProfile")
  .get(becomeDoctorDetail)

router.route("/updatedoctorProfile/:id")
  .get(updateGetDoctorDisplay)


router.route("/doctorDashBoard/:id")
.get(doctorDashBoard)
 
router.route('/doctorSideBarDetail/:id')
  .get(getDoctorSideBarDetail)
  
  router.route('/doctorPaymentHistory/:id')
  .get(getPaymentHistory)
  
  module.exports = router