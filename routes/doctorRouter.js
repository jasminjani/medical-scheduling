const express = require("express");
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });
// import Controller File
const {
  becomeDoctorDetail,
  getPatientHistoryDetail,
  patientHistoryData,
  getPatientData,
  getPatientDetail,
  doctorReviewData,
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
  logoutController,
  dashBoardCount,
  dashBoardReviews,
  dashBoardAppointments,

} = require("../controllers/doctorController");
const passport = require("passport");
const { paymentHistory, showpaymentHistory, searchPaymentHistory } = require("../controllers/doctorPaymentHistory");
const { patientPaymentHistory, showPatientPayment, searchPatientPayment } = require("../controllers/doctorPatientPaymentHistory");


// slot 
const { createSlots, getSingleSlots, bookingSlot, getAllSlots, deleteSlot, cancelSlot, createSlotsPage, getSlotsPage, getDates,  getBookingSlots, DoctorCobmo } = require('../controllers/slotController');


router.route("/allDoctorProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), allDoctor)


router.route("/doctorCreateProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), becomeDoctorDetail)

router.route("/doctorCreateProfile")
  .post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), createDoctor)


router.route("/updatedoctorProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), updateGetDoctorDisplay)


router.route("/updatedoctorProfile")
  .post(imgUpload.single('profile_picture'),passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), updateDoctorDetails)


router.route('/getDoctorReview')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getDoctorReview)


// Router show json format Data date:- 12-04-2024

router.route("/dashBoarAppointments")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),dashBoardAppointments)

router.route("/dashBoardReviews")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),dashBoardReviews)
router.route("/dashBoardCount")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), dashBoardCount)

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


router.route('/viewPatientHistory/:patient_id')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getPatientHistoryDetail)

router.route("/viewPatientDetailsData/:patient_id")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), patientDetailsData)


router.route("/patientPrescriptionData/:patient_id/:date")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), patientPrescriptionData)

router.route("/logout").get(logoutController)
















//jasmin jani dt:- 18/04/2024


// for doctor panel payment history
router.route('/doctorPaymentHistory')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), paymentHistory);

router.route('/showpaymentHistory')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), showpaymentHistory);

router.route('/searchedPaymentHistory/:search')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), searchPaymentHistory);

// for patient payment history in payment history
router.route('/doctorPaymentHistory/:patient_id')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), patientPaymentHistory);

router.route('/showPatientHistoryData/:patient_id')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), showPatientPayment);

// router.route('/searchedPaymentHistory/:patient_id/:search')
//   .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), searchPatientPayment);




// Darshan Slot Router

router.route("/addSlot").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), createSlotsPage);
router.route("/slot").post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), createSlots)

router.route("/slot").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getBookingSlots);
router.route("/bookslot").post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), bookingSlot); 
router.route('/getDoctors').post(DoctorCobmo)

router.route("/slots").post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getSingleSlots);
router.route("/upcomingSlots").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), getSlotsPage);
router.route("/dates").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), getDates);
router.route("/slots/:date").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), getAllSlots);
router.route("/delete/:slot_id").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), deleteSlot);
router.route("/cancel/:slot_id").put(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), cancelSlot)



module.exports = router;
