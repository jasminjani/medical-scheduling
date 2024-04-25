const express = require("express");
const router = express.Router();
const { imgStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const passport = require("passport");
const { getPendingDoctorById, updateGetDoctorDisplay, updateDoctorDetails, createHospital, getDoctorReview, dashBoardTodayAppointments, dashBoardReviews, dashBoardCount, doctorData, getCityCombo, updateGetDoctorData, doctorReviewData, getPatientData, getPatientHistoryDetail, patientHistoryData, doctorDisplay, getPatientDetail, doctorDashBoard, patientDetailsData, patientPrescriptionData, doctorPanelPaymentHistory, showpaymentHistory, searchPaymentHistory, patientPaymentHistory, showPatientPayment, createSlotsPage, createSlots, getUpcomingSlotPage, getDates, getAllSlots, deleteSlot, searchReview, getPatientSearchData, updateDetailsData, updatePrescription, createPrescription, getPrescriptionOfDoctor, showDetails, home, allPatientPriscription, editPrescriptionHome, allSpecialities } = require('../controllers/doctorController');
const { isDoctor } = require('../middlewares/authMiddleware');
const { allDoctors } = require("../controllers/authController");
const { generatePDF } = require('../controllers/pdfController')
// /allDoctorProfile
router
  .route("doctors/all")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    allDoctors
  );

// for the home page
// /getPendingDoctor
router
  .route("/doctor/pending")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getPendingDoctorById
  );

  // /updatedoctorProfile
router
  .route("/profile/update")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    updateGetDoctorDisplay
  )
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    imgUpload.single("profile_picture"),
    updateDoctorDetails
  );

router.route("/createHospital").post(createHospital);

// /getDoctorReview
router
  .route("/reviews")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getDoctorReview
  );

// /dashBoardAppointments
router
  .route("/appointments/today")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    dashBoardTodayAppointments
  );

  // /dashBoardReviews
router
  .route("/reviews/all")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    dashBoardReviews
  );

  // /dashBoardCount
router
  .route("/analytics")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    dashBoardCount
  );

  // /doctorData
router
  .route("/data")
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

  // /updateDoctorData
router
  .route("/updateDoctorData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    updateGetDoctorData
  );


  // TODO : remove with /reviews/all
router
  .route("/reviews")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    doctorReviewData
  );

  // /getPatientData
router
  .route("/patients")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getPatientData
  );

  // /getpatientHistoryData/:patient_id
    // /viewPatientHistory/:patient_id
router
  .route("/patients/history/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getPatientHistoryDetail
  )
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    patientHistoryData
  );

router.route("/reviews/:id").get(isDoctor, doctorReviewData);

// Router show doctor details date:- 12-04-2024

// /doctorProfile
router
  .route("/profile")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    doctorDisplay
  );

  // /getPatientDetails
router
  .route("/patient/detail")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    getPatientDetail
  );

// /doctorDashBoard
router
  .route("/dashboard")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    doctorDashBoard
  );



 
// /viewPatientDetailsData/:patient_id
router
  .route("/patient/view/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    patientDetailsData
  );

  // TODO : Change get -> post and route also
router
  .route("/patientPrescriptionData/:date/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    patientPrescriptionData
  );

router.route("/specialities").get(allSpecialities);

//jasmin jani dt:- 18/04/2024

// for doctor panel payment history
// /doctorPaymentHistory
//showpaymentHistory
router
  .route("/payment/history")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    doctorPanelPaymentHistory
  )
  .post(
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
// /doctorPaymentHistory/:patient_id
// /showPatientHistoryData/:patient_id
router
  .route("/payment/history/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    patientPaymentHistory
  ).post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isDoctor,
    showPatientPayment
  );

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
  // .get(
  //   passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  //   isDoctor,
  //   getBookingSlots
  // );

// render upcoming slot page to doctor
router
  .route("/slots")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getUpcomingSlotPage
  );

// router
//   .route("/upcomingSlots")
//   .get(
//     passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
//     isDoctor,
//     getSlotsPage
//   );

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
  .route("/searchReview/:search")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    searchReview
  );
router
  .route("/searchPatientData/:search")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getPatientSearchData
  );

  // /generatePDFofprescripton/:id
router.route("/generate/:id").get(generatePDF);

// /updatedetails/:id
// /updatePrescription/:id
router.route("/prescription/update/:id").get(updateDetailsData).post(updatePrescription)

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
