const express = require("express");
const router = express.Router();

const { isAdmin } = require("../middlewares/authMiddleware");
const {
  dashboardStatus,
  deleteDoctor,
  getAllDoctors,
  appointmentDetails,
  getPatientAllAppointment,
  patientAllAppointment,
  searchPatientByName,
  displayAllPatient,
  getAllPatients,
  rejectDoctor,
  approveDoctor,
  showDoctorDetail,
  showDoctorDetailRend,
  individualDoctor,
  individualDoctorRend,
  getNewSpecialties,
  getSpecialties,
  adminAddSpecialites,
  addNewSpecialties,
  adminApproveDoctors,
  adminDeleteDoctors,
  adminDashboard,
  contactToAdmin,
  getAllMessage,
} = require("../controllers/adminController");
const passport = require("passport");

router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  isAdmin
);

// admin sidebar routes
// /admin
router.route("/").get(adminDashboard);

// /admin/all-doctors
router.route("/doctors/all").get(adminDeleteDoctors);

// /admin/approve-doctors
router.route("/doctors/approve").get(adminApproveDoctors);

// /admin/add-specialites
router
  .route("/specialities/add")
  .get(adminAddSpecialites)
  .post(addNewSpecialties);

// add specialties in admin panel
// /admin/get-specialties
router.route("/specialties").get(getSpecialties);

// /admin/get-new-specialties
router.route("/specialities/new").get(getNewSpecialties);

// approve doctor panel in admin panel

// /individual-doctor/:id
router.route("/doctor/:id").get(individualDoctorRend);

// /individual-doctor-details/:id
router.route("/doctorDetails/:id").get(individualDoctor);

// /show-doctor-deatil/:id
router.route("/show/doctorDetail/:id").get(showDoctorDetailRend);

// /show-doctor-details/:id
router.route("/show/doctorDetails/:id").get(showDoctorDetail);

// /approve-doctor/:id
router.route("/doctor/approve/:id").get(approveDoctor);

// /reject-doctor/:id
router.route("/doctor/reject/:id").get(rejectDoctor);

// Display all patient and search patient
// /admin/get-all-patient
router.route("/patient/getAll").get(getAllPatients);

// /admin/all-patient
router.route("/patient/all").get(displayAllPatient);

// TODO : delete route
router
  .route("/admin/display-search-patient/:searchedName")
  .get(searchPatientByName);

// patient appointment details
// /admin/patient-appointment/:patient_id
router.route("/patient/appointment/:patient_id").get(patientAllAppointment);

// /admin/get-patient-appointment/:patient_id
router
  .route("/patient/getAppointment/:patient_id")
  .get(getPatientAllAppointment);

// /admin/patient-appointment/:patient_id/:slot_id
// slot_id req.body
router.route("/patient/appointment/slot/:patient_id").post(appointmentDetails);

// all doctor list in admin panel
// /admin/get-all-doctors
router.route("/allDoctor").get(getAllDoctors);

// /admin/delete-doctor/:id
router.route("/doctors/delete/:id").get(deleteDoctor);

// ADMIN dashboard api
// /getDashboardStatus
router.route("/analytics").get(dashboardStatus);

router.route("/contact-us").get(contactToAdmin);
router.route("/get-message").get(getAllMessage);

module.exports = router;
