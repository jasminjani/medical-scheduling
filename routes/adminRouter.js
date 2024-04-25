const express = require("express");
const router = express.Router();

const { isAdmin } = require("../middlewares/authMiddleware");
const { dashboardStatus, deleteDoctor, getAllDoctors, appointmentDetails, getPatientAllAppointment, patientAllAppointment, searchPatientByName, displayAllPatient, getAllPatients, rejectDoctor, approveDoctor, showDoctorDetail, showDoctorDetailRend, individualDoctor, individualDoctorRend, getNewSpecialties, getSpecialties, adminAddSpecialites, addNewSpecialties, adminApproveDoctors, adminDeleteDoctors, adminDashboard } = require("../controllers/adminController");
const passport = require("passport");


router.use(
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" })
);


// admin sidebar routes
// /admin
router.route("/").get(isAdmin, adminDashboard);

// /admin/all-doctors
router.route("/doctors/all").get(isAdmin, adminDeleteDoctors);

// /admin/approve-doctors
router.route("/doctors/approve").get(isAdmin, adminApproveDoctors);

// /admin/add-specialites
router.route("/specialities/add").get(isAdmin, adminAddSpecialites)
.post(isAdmin, addNewSpecialties);

// add specialties in admin panel
// /admin/get-specialties
router.route("/specialties").get(isAdmin, getSpecialties);

// /admin/get-new-specialties
router.route("/specialities/new").get(isAdmin, getNewSpecialties);


// approve doctor panel in admin panel

// /individual-doctor/:id
router.route("/doctor/:id").get(isAdmin, individualDoctorRend);

// /individual-doctor-details/:id
router
  .route("/doctorDetails/:id")
  .get(isAdmin, individualDoctor);

  // /show-doctor-deatil/:id
router.route("/show/doctorDetail/:id").get(isAdmin, showDoctorDetailRend);

// /show-doctor-details/:id
router.route("/show/doctorDetails/:id").get(isAdmin, showDoctorDetail);

// /approve-doctor/:id
router.route("/doctor/approve/:id").get(isAdmin, approveDoctor);

// /reject-doctor/:id
router.route("/doctor/reject/:id").get(isAdmin, rejectDoctor);

// Display all patient and search patient
// /admin/get-all-patient
router.route("/patient/getAll").get(isAdmin, getAllPatients);

// /admin/all-patient
router.route("/patient/all").get(isAdmin, displayAllPatient);

// TODO : delete route
router
  .route("/admin/display-search-patient/:searchedName")
  .get(isAdmin, searchPatientByName);

// patient appointment details
// /admin/patient-appointment/:patient_id
router
  .route("/patient/appointment/:patient_id")
  .get(isAdmin, patientAllAppointment);

  // /admin/get-patient-appointment/:patient_id
router
  .route("/patient/getAppointment/:patient_id")
  .get(isAdmin, getPatientAllAppointment);

  // /admin/patient-appointment/:patient_id/:slot_id
  // slot_id req.body
router
  .route("/patient/appointment/slot/:patient_id")
  .get(isAdmin, appointmentDetails);

// all doctor list in admin panel
// /admin/get-all-doctors
router.route("/doctors/all").get(isAdmin, getAllDoctors);

// /admin/delete-doctor/:id
router.route("/doctors/delete/:id").get(isAdmin, deleteDoctor);

// ADMIN dashboard api
// /getDashboardStatus
router.route("/dashboard").get(isAdmin, dashboardStatus);

module.exports = router;
