const express = require("express");
const router = express.Router();
const { imgStorage,fileStorage } = require("../utils/multer");
const multer = require("multer");
const fileUpload = multer({ storage: fileStorage });
const imgUpload = multer({ storage: imgStorage });
const { isPatient } = require("../middlewares/authMiddleware");
const passport = require("passport");
const { patientProfile, patientPastProfile, patientUpcomingBookings, patientPastBookings, getDoctorSlotsById, getSingleSlots, cancelSlot, patientPayments, patientPanelPaymentHistory, patientDashboard, patientStatus, patientDetails, addPatientDetails, patientViewProfile, patientViewProfileData, getpatientProfileUpdate, postPatientProfileUpdate, patientProfileUpdateData } = require("../controllers/patientController");
const { becomeDoctorDetail, createDoctor, searchPatientPayment, getPrescriptionOfUser } = require("../controllers/doctorController");
const { allDoctors } = require("../controllers/authController");
const { generatePDF } = require("../controllers/pdfController");
// Patients panel details(patientAllControllers)

// /patientUpcomingSlots
router
  .route("/upcomingSlots")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isPatient,
    patientProfile
  );

// /patientPastSlots
router
  .route("/pastSlots")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isPatient,
    patientPastProfile
  );

router
  .route("/bookings/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isPatient,
    patientUpcomingBookings
  );

router
  .route("/pastbookings/:patient_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isPatient,
    patientPastBookings
  );

router
  .route("/bookslots/:id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getDoctorSlotsById
  );

router
  .route("/slots")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getSingleSlots
  );

router
  .route("/cancel/:slot_id")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    isPatient,
    cancelSlot
  );

// /doctorCreateProfile
router
  .route("/create")
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

// Patient panel Payment history routes
router
  .route("/payments")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    patientPayments
  );

// /patient-paymentHistory
router
  .route("/payments/history")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    patientPanelPaymentHistory
  );

// TODO : remove route
router
  .route("/searchedPatientPayment/:searchedData")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    searchPatientPayment
  );

router
  .route("/doctors/all")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    allDoctors
  );

// /patient route
router.route("/").get(patientDashboard);

// /patient-status/:id
router.route("/analytics").get(patientStatus);

// /patient-details
router.route("/details").post(patientDetails);

// /add-patient-details
router
  .route("/otherDetails")
  .post(fileUpload.single("medicalHistory"), addPatientDetails);


  // /viewPatientProfile
router.route("/view/profile").get(patientViewProfile);

// /viewPatientProfileData
router.route("/view/profileData").get(patientViewProfileData);

// /patientProfileUpdate
router.route("/profile/update").get(getpatientProfileUpdate)
  .post(imgUpload.single("profile_picture"), postPatientProfileUpdate);

  // /patientProfileUpdateData  
router.route("/update/profileData").get(patientProfileUpdateData);

// p
router.route("/getprescriptionofuser").get(getPrescriptionOfUser);

// d p
router.route("/generate/:id").get(generatePDF);

module.exports = router;
