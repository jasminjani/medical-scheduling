const express = require("express");
const router = express.Router();
const { imgStorage, fileStorage,imageFilter,fileFilter } = require("../utils/multer");
const multer = require("multer");
const fileUpload = multer({ storage: fileStorage,fileFilter:fileFilter });
const imgUpload = multer({ storage: imgStorage,fileFilter:imageFilter });
const { isPatient } = require("../middlewares/authMiddleware");
const passport = require("passport");




const {
  patientProfile,
  patientPastProfile,
  patientUpcomingBookings,
  patientPastBookings,
  getSingleSlots,
  cancelSlot,
  patientPayments,
  patientPanelPaymentHistory,
  patientDashboard,
  patientStatus,
  patientDetails,
  addPatientDetails,
  patientViewProfile,
  patientViewProfileData,
  getpatientProfileUpdate,
  postPatientProfileUpdate,
  patientProfileUpdateData,
  bookingSlot,
  getBookingSlots,
  rating,
  getDoctorRating,
  updateRating,
  nearByDoctores,
  searchPatientPaymentHistory,
  updateBecomeDoctorDetails,
  updatePostBecomeDoctor,
  updateBecomeDoctorData,
  knowStatus,
} = require("../controllers/patientController");
const {
  becomeDoctorDetail,
  createDoctor,
  getPrescriptionOfUser,
  getPendingDoctorById,
} = require("../controllers/doctorController");
const { allDoctors, updateNotification } = require("../controllers/authController");
const { generatePDF } = require("../controllers/pdfController");


// Patients panel details(patientAllControllers)
router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  isPatient
);


// patient Dashboard
// /patient route 
router.route("/").get(patientDashboard);

// /patient/analytics
router.route("/analytics").get(patientStatus);


// /patientUpcomingSlots
router.route("/upcomingSlots").get(patientProfile);

// /patientPastSlots
router.route("/pastSlots").get(patientPastProfile);

router.route('/bookslot').post(bookingSlot)

router.route("/bookings/:patient_id").get(patientUpcomingBookings);

router.route("/pastbookings/:patient_id").get(patientPastBookings);

router.route("/bookslots/:id").get(getBookingSlots);

router.route("/slots").post(getSingleSlots);

router.route("/cancel/:slot_id").get(cancelSlot);

// /doctorCreateProfile
router.route("/create").get(becomeDoctorDetail).post(createDoctor);

// Patient panel Payment history routes
router.route("/payments").get(patientPayments);

// /patient-paymentHistory
router.route("/payments/history").get(patientPanelPaymentHistory);

// patient's search payment history routes
router.route("/payments/:searchedData").get(searchPatientPaymentHistory);

router.route("/doctors/all").get(allDoctors);

// for the home page -> patient route homepage
// /getPendingDoctor
router.route("/doctor/pending").post(getPendingDoctorById);



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
router
  .route("/profile/update")
  .get(getpatientProfileUpdate)
  .post(imgUpload.single("profile_picture"), postPatientProfileUpdate);

// /patientProfileUpdateData
router.route("/update/profileData").get(patientProfileUpdateData);

// p
router.route("/getprescriptionofuser").get(getPrescriptionOfUser);

// d p
router.route("/generate/:id").get(generatePDF);

//patient review doctor
router.route("/review").post(rating);

router.route("/review/:doctor_id").get(getDoctorRating);

router.route("/review/update/:doctor_id").get(updateRating);



router.route("/updateBecomeDoctorDetails").get(updateBecomeDoctorDetails).post(updatePostBecomeDoctor);
router.route("/updateBecomeDoctorData").get(updateBecomeDoctorData)
router.route("/knowStatus").get(knowStatus)



// for display patient near by doctor
router.route("/getNearByDoctor").get(nearByDoctores);

router.route("/notification").put(updateNotification)

module.exports = router;
