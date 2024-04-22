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
const {isDoctor, isPatient} = require('../middlewares/authMiddleware')

router.route("/allDoctorProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),isDoctor, allDoctor)


router.route("/doctorCreateProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),isPatient, becomeDoctorDetail)
  .post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),isPatient, createDoctor)

router.route("/updatedoctorProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), isDoctor,updateGetDoctorDisplay)


router.route("/updatedoctorProfile")
  .post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),isDoctor,imgUpload.single('profile_picture'), updateDoctorDetails)


router.route('/getDoctorReview')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), isDoctor,getDoctorReview)


// Router show json format Data date:- 12-04-2024

router.route("/dashBoardAppointments")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),isDoctor,dashBoardAppointments)

router.route("/dashBoardReviews")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),isDoctor,dashBoardReviews)
router.route("/dashBoardCount")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), isDoctor,dashBoardCount)

router
  .route("/doctorData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,doctorData
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
    isDoctor,doctorPaymentData
  );

router
  .route("/updateDoctorData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,updateGetDoctorData
  );

router
  .route("/reviews")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor, doctorReviewData
  );

router
  .route("/getPatientData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor, getPatientData
  );

router
  .route("/getpatientHistoryData/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,patientHistoryData
  );

router.route("/reviews/:id").get(isDoctor,doctorReviewData);

// Router show doctor details date:- 12-04-2024
router.route("/doctorProfile")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), isDoctor,doctorDisplay)


router.route("/getPatientDetails")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), isDoctor,getPatientDetail)





router.route("/doctorDashBoard")
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),isDoctor, doctorDashBoard)

router.route('/doctorSideBarDetail')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getDoctorSideBarDetail)

// router.route('/doctorPaymentHistory')
//   .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getPaymentHistory)


router.route('/viewPatientHistory/:patient_id')
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), isDoctor,getPatientHistoryDetail)

router.route("/viewPatientDetailsData/:patient_id")
  .get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), isDoctor,patientDetailsData)


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
  .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), isDoctor,showPatientPayment);

// router.route('/searchedPaymentHistory/:patient_id/:search')
//   .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), searchPatientPayment);




// Darshan Slot Router

router.route("/addSlot").get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),isDoctor, createSlotsPage);
router.route("/slot").post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),isDoctor, createSlots).get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),isDoctor, getBookingSlots);


router.route("/bookslot").post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), bookingSlot); 
router.route('/getDoctors').post(DoctorCobmo)

router.route("/slots").post(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getSingleSlots);
router.route("/upcomingSlots").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), isDoctor,getSlotsPage);
router.route("/dates").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),isDoctor, getDates);
router.route("/slots/:date").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), isDoctor,getAllSlots);
router.route("/delete/:slot_id").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),isDoctor, deleteSlot);
router.route("/cancel/:slot_id").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),isPatient, cancelSlot)



module.exports = router;
