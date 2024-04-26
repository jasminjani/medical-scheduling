const express = require("express");
const router = express.Router();
const { imgStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const passport = require("passport");
const {
  updateGetDoctorDisplay,
  updateDoctorDetails,
  createHospital,
  getDoctorReview,
  dashBoardTodayAppointments,
  dashBoardReviews,
  dashBoardCount,
  doctorData,
  updateGetDoctorData,
  getPatientData,
  getPatientHistoryDetail,
  patientHistoryData,
  doctorDisplay,
  getPatientDetail,
  doctorDashBoard,
  patientDetailsData,
  patientPrescriptionData,
  doctorPanelPaymentHistory,
  showpaymentHistory,
  searchPaymentHistory,
  patientPaymentHistory,
  showPatientPayment,
  createSlotsPage,
  createSlots,
  getUpcomingSlotPage,
  getDates,
  getAllSlots,
  deleteSlot,
  searchReview,
  getPatientSearchData,
  updateDetailsData,
  updatePrescription,
  createPrescription,
  getPrescriptionOfDoctor,
  showDetails,
  home,
  allPatientPriscription,
  editPrescriptionHome,
  getSlotsPage,
} = require("../controllers/doctorController");
const { isDoctor } = require("../middlewares/authMiddleware");
const { allDoctors } = require("../controllers/authController");
const { generatePDF } = require("../controllers/pdfController");

router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  isDoctor
);
// /allDoctorProfile
router.route("/doctors/all").get(allDoctors);

// /updatedoctorProfile
router
  .route("/profile/update")
  .get(updateGetDoctorDisplay)
  .post(imgUpload.single("profile_picture"), updateDoctorDetails);

router.route("/createHospital").post(createHospital);

// /getDoctorReview
router.route("/reviews").get(getDoctorReview);

// /dashBoardAppointments
router.route("/appointments/today").get(dashBoardTodayAppointments);

// /dashBoardReviews
router.route("/reviews/all").get(dashBoardReviews);

// /dashBoardCount
router.route("/analytics").get(dashBoardCount);

// /doctorData
router.route("/data").get(doctorData);



// /updateDoctorData
router.route("/updateDoctorData").get(updateGetDoctorData);

// TODO : remove with /reviews/all


// /getPatientData
router.route("/patients").get(getPatientData);

// /getpatientHistoryData/:patient_id
// /viewPatientHistory/:patient_id
router
  .route("/patients/history/:patient_id")
  .get(getPatientHistoryDetail)
  .post(patientHistoryData);

// router.route("/reviews/:id").get(doctorReviewData);

// Router show doctor details date:- 12-04-2024

// /doctorProfile
router.route("/profile").get(doctorDisplay);

// /getPatientDetails
router.route("/patient/detail").get(getPatientDetail);

// /doctorDashBoard
router.route("/dashboard").get(doctorDashBoard);

// /viewPatientDetailsData/:patient_id
router.route("/patient/view/:patient_id").get(patientDetailsData);

// TODO : Change get -> post and route also
router
  .route("/patientPrescriptionData/:date/:patient_id")
  .get(patientPrescriptionData);



//jasmin jani dt:- 18/04/2024

// for doctor panel payment history
// /doctorPaymentHistory
//showpaymentHistory
router
  .route("/payment/history")
  .get(doctorPanelPaymentHistory)
  .post(showpaymentHistory);

router.route("/searchedPaymentHistory/:search").get(searchPaymentHistory);

// for patient payment history in payment history
// /doctorPaymentHistory/:patient_id
// /showPatientHistoryData/:patient_id
router
  .route("/payment/history/:patient_id")
  .get(patientPaymentHistory)
  .post(showPatientPayment);

// Darshan Slot Router

router.route("/addSlot").get(createSlotsPage);
router.route("/slot").post(createSlots);
// .get(
//
//
//   getBookingSlots
// );

// render upcoming slot page to doctor
router.route("/slots").get(getUpcomingSlotPage);

router.route("/upcomingSlots").get(getSlotsPage);

router.route("/dates").get(getDates);
router.route("/slots/:date").get(getAllSlots);
router.route("/delete/:slot_id").get(deleteSlot);

router.route("/searchReview/:search").get(searchReview);
router.route("/searchPatientData/:search").get(getPatientSearchData);

// /generatePDFofprescripton/:id
router.route("/generate/:id").get(generatePDF);

// /updatedetails/:id
// /updatePrescription/:id
router
  .route("/prescription/update/:id")
  .get(updateDetailsData)
  .post(updatePrescription);

// /createprescription
router.route("/prescription/create").post(createPrescription);

// /getprescriptionofdoctor
router.route("/prescriptions").get(getPrescriptionOfDoctor);

// /createprescription/:patient_id
router.route("/patient/prescription/:patient_id").get(showDetails);

// TODO : change route
router.route("/prescription/:patient_id/:booking_id").get(home);

router.route("/prescriptiondetails").get(allPatientPriscription);

// /editprescription/:id
router.route("/prescription/edit/:id").get(editPrescriptionHome);

module.exports = router;
