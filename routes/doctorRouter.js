const express = require("express");
const router = express.Router();
// import Controller File
const {
  becomeDoctorDetail,
  getPatientHistoryDetail,
  patientHistoryData,
  getPatientData,
  getPatientDetail,
  doctorReviewData,
  getPaymentHistory,
  doctorPaymentData,
  doctorDashBoard,
  getCityCombo,
  getDoctorSideBarDetail,
  allDoctor,
  createDoctor,
  doctorDisplay,
  updateDoctorDetails,
  getDoctorReview,
  doctorData,
  updateGetDoctorData,
  updateGetDoctorDisplay,
  patientDetailsData,
  patientPrescriptionData,
  logoutController
} = require("../controllers/doctorController");
const passport = require("passport");


router.route("/allDoctorProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), allDoctor)


router.route("/doctorCreateProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), becomeDoctorDetail)  

router.route("/doctorCreateProfile")
  .post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), createDoctor)


router.route("/updatedoctorProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), updateGetDoctorDisplay)

  
  router.route("/updatedoctorProfile")
  .post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), updateDoctorDetails)
  
  
  router.route('/getDoctorReview')
    .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getDoctorReview)


// Router show json format Data date:- 12-04-2024
router
  .route("/doctorData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    doctorData
  );

router
  .route("/cityCombo")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getCityCombo
  );

router
  .route("/doctorPaymentData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    doctorPaymentData
  );

router
  .route("/updateDoctorData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    updateGetDoctorData
  );

router
  .route("/reviews")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    doctorReviewData
  );

router
  .route("/getPatientData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getPatientData
  );

router
  .route("/getpatientHistoryData/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    patientHistoryData
  );

router.route("/reviews/:id").get(doctorReviewData);

// Router show doctor details date:- 12-04-2024
router.route("/doctorProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), doctorDisplay)


router.route("/getPatientDetails")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getPatientDetail)





router.route("/doctorDashBoard")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), doctorDashBoard)

router.route('/doctorSideBarDetail')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getDoctorSideBarDetail)

// router.route('/doctorPaymentHistory')
//   .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getPaymentHistory)

// router.route('/doctorPaymentHistory')
//   .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getPaymentHistorys)

router.route('/viewPatientHistory/:patient_id')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getPatientHistoryDetail)

 router.route("/viewPatientDetailsData/:patient_id")
   .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),patientDetailsData) 


router.route("/patientPrescriptionData/:patient_id/:date")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), patientPrescriptionData)

router.route("/logout").get(logoutController)  

module.exports = router;
