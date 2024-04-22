const express = require("express");
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const passport = require("passport");

// const { paymentHistory, showpaymentHistory, searchPaymentHistory } = require("../controllers/D");
// const { patientPaymentHistory, showPatientPayment, searchPatientPayment } = require("../controllers/doctorPatientPaymentHistory");

// slot
const {
  createSlots,
  getSingleSlots,
  bookingSlot,
  getAllSlots,
  deleteSlot,
  cancelSlot,
  createSlotsPage,
  getSlotsPage,
  getDates,
  getBookingSlots,
  DoctorCobmo,
} = require("../controllers/slotController");
const {
  becomeDoctorDetail,
  updateGetDoctorDisplay,
  getDoctorReview,
  doctorDisplay,
  getPatientDetail,
  getPatientHistoryDetail,
  logoutController,
  doctorDashBoard,
} = require("../controllers/doctorModule/doctorController");
const {
  createDoctor,
} = require("../controllers/doctorModule/docotorProfileCreateController");
const {
  updateDoctorDetails,
  updateGetDoctorData,
} = require("../controllers/doctorModule/doctorProfileUpdateController");
const {
  dashBoardAppointments,
  dashBoardReviews,
  dashBoardCount,
 
} = require("../controllers/doctorModule/doctorDashboard");
const { doctorData } = require("../controllers/doctorModule/doctorProfile");
const {
  doctorReviewData,
} = require("../controllers/doctorModule/doctorReviewController");
const {
  getPatientData,
  patientHistoryData,
  patientDetailsData,
  patientPrescriptionData,
} = require("../controllers/doctorModule/doctorPanelPatientController");
const {
  getDoctorSideBarDetail,
} = require("../controllers/doctorModule/doctorSidebarController");
const {
  allSpecialities,
} = require("../controllers/doctorModule/doctorSpecialitiesController");
const {
  showPatientPayment,
  patientPaymentHistory,
  searchPaymentHistory,
  showpaymentHistory,
} = require("../controllers/doctorModule/doctorPaymentHistoryController");
const {
  paymentHistory,
} = require("../controllers/patientAllAppointController");
const {
  getCityCombo,
} = require("../controllers/doctorModule/doctorCityComboController");

router
  .route("/doctorCreateProfile")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    becomeDoctorDetail
  );

router
  .route("/doctorCreateProfile")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    createDoctor
  );

router
  .route("/updatedoctorProfile")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    updateGetDoctorDisplay
  );

router
  .route("/updatedoctorProfile")
  .post(
    imgUpload.single("profile_picture"),
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    updateDoctorDetails
  );

router
  .route("/getDoctorReview")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getDoctorReview
  );

// Router show json format Data date:- 12-04-2024

router
  .route("/dashBoardAppointments")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    dashBoardAppointments
  );

router
  .route("/dashBoardReviews")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    dashBoardReviews
  );
router
  .route("/dashBoardCount")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    dashBoardCount
  );

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
router
  .route("/doctorProfile")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    doctorDisplay
  );

router
  .route("/getPatientDetails")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getPatientDetail
  );

router
  .route("/doctorDashBoard")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    doctorDashBoard
  );

router
  .route("/doctorSideBarDetail")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getDoctorSideBarDetail
  );

// router.route('/doctorPaymentHistory')
//   .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getPaymentHistory)

router
  .route("/viewPatientHistory/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getPatientHistoryDetail
  );

router
  .route("/viewPatientDetailsData/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    patientDetailsData
  );

router
  .route("/patientPrescriptionData/:patient_id/:date")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    patientPrescriptionData
  );

router.route("/logout").get(logoutController);

router.route("/specialities").get(allSpecialities);

//jasmin jani dt:- 18/04/2024

// for doctor panel payment history
router
  .route("/doctorPaymentHistory")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    paymentHistory
  );

router
  .route("/showpaymentHistory")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    showpaymentHistory
  );

router
  .route("/searchedPaymentHistory/:search")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    searchPaymentHistory
  );

// for patient payment history in payment history
router
  .route("/doctorPaymentHistory/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    patientPaymentHistory
  );

router
  .route("/showPatientHistoryData/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    showPatientPayment
  );



// Darshan Slot Router

router
  .route("/addSlot")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    createSlotsPage
  );
router
  .route("/slot")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    createSlots
  );

router
  .route("/slot")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getBookingSlots
  );
router
  .route("/bookslot")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    bookingSlot
  );
router.route("/getDoctors").post(DoctorCobmo);

router
  .route("/slots")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getSingleSlots
  );
router
  .route("/upcomingSlots")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getSlotsPage
  );
router
  .route("/dates")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getDates
  );
router
  .route("/slots/:date")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getAllSlots
  );
router
  .route("/delete/:slot_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    deleteSlot
  );
router
  .route("/cancel/:slot_id")
  .put(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    cancelSlot
  );

module.exports = router;
