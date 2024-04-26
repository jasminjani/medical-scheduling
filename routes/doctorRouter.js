const express = require("express");
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const passport = require("passport");



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
  createDoctor, getPendingDoctorById,
} = require("../controllers/doctorModule/docotorProfileCreateController");
const {
  updateDoctorDetails,
  updateGetDoctorData,
} = require("../controllers/doctorModule/doctorProfileUpdateController");
const {
  dashBoardAppointments,
  dashBoardReviews,
  dashBoardCount,
  dashBoardTodayAppointments

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
  doctorPanelPaymentHistory,
} = require("../controllers/doctorModule/doctorPaymentHistoryController");

const { isDoctor, isPatient } = require("../middlewares/authMiddleware");

const {
  getCityCombo,
} = require("../controllers/doctorModule/doctorCityComboController");
const { allDoctors } = require("../controllers/userController");




router
  .route("/allDoctorProfile")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    allDoctors
  );

router.route('/getPendingDoctor').post(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
getPendingDoctorById)

router
  .route("/doctorCreateProfile")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isPatient,
    becomeDoctorDetail
  )
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isPatient,
    createDoctor
  );

router
  .route("/updatedoctorProfile")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    updateGetDoctorDisplay
  );


router
  .route("/doctorCreateProfile")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    becomeDoctorDetail
  );

router
  .route("/updatedoctorProfile")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    imgUpload.single("profile_picture"),
    updateDoctorDetails
  );

router
  .route("/getDoctorReview")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getDoctorReview
  );

// Router show json format Data date:- 12-04-2024

// router
//   .route("/dashBoardAppointments")
//   .get(
//     passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
//     isDoctor,
//     dashBoardAppointments
//   );

router
  .route("/dashBoardAppointments")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    dashBoardTodayAppointments
  );  

router
  .route("/dashBoardReviews")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    dashBoardReviews
  );
router
  .route("/dashBoardCount")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
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
    isDoctor,
    updateGetDoctorData
  );

router
  .route("/reviews")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    doctorReviewData
  );

router
  .route("/getPatientData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getPatientData
  );
  

router
  .route("/getpatientHistoryData/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    patientHistoryData
  );

router.route("/reviews/:id").get(isDoctor, doctorReviewData);

// Router show doctor details date:- 12-04-2024
router
  .route("/doctorProfile")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    doctorDisplay
  );

router
  .route("/getPatientDetails")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getPatientDetail
  );

router
  .route("/doctorDashBoard")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
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
  .route("/viewPatientHistory/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getPatientHistoryDetail
  );

router
  .route("/viewPatientDetailsData/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    patientDetailsData
  );

// router
//   .route("/patientPrescriptionData/:patient_id/:date")
//   .get(
//     passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
//     patientPrescriptionData
//   );

router.route("/logout").get(logoutController);

router
  .route("/patientPrescriptionData/:date/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    patientPrescriptionData
  );

router.route("/specialities").get(allSpecialities);

//jasmin jani dt:- 18/04/2024

// for doctor panel payment history
router
  .route("/doctorPaymentHistory")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    doctorPanelPaymentHistory
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
    isDoctor,
    showPatientPayment
  );

// router.route('/searchedPaymentHistory/:patient_id/:search')
//   .get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), searchPatientPayment);

// Darshan Slot Router

router
  .route("/addSlot")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    createSlotsPage
  );
router
  .route("/slot")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    createSlots
  )
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
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
    isDoctor,
    getSlotsPage
  );
router
  .route("/dates")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getDates
  );
router
  .route("/slots/:date")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getAllSlots
  );
router
  .route("/delete/:slot_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    deleteSlot
  );
router
  .route("/cancel/:slot_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isPatient,
    cancelSlot
  );

module.exports = router;
