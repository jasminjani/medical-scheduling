const express = require('express');
const { getSpecialties, deleteSpecialty, getNewSpecialties, addNewSpecialties } = require('../controllers/adminModule/adminGetSpecialtiesController');
const { individualDoctor, approveDoctor, rejectDoctor, getAllDoctors, deleteDoctor,individualDoctorRend} = require('../controllers/adminModule/adminApproveDocController');
const { displayAllPatient, searchPatientByName, getAllPatients } = require('../controllers/adminModule/adminPanelPatientController');
const { patientAllAppointment, appointmentDetails, getPatientAllAppointment } = require('../controllers/adminModule/patientAllAppointController');
const { adminDeleteDoctors, adminApproveDoctors, adminAddSpecialites, adminDashboard } = require('../controllers/adminModule/adminPanelController');
const passport = require('passport');
const { profilePhoto } = require('../controllers/adminModule/profilePhotoController');
const { dashboardStatus } = require('../controllers/adminModule/adminDashboardController');


const adminRouter = express.Router()

adminRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }))

// profile photo
adminRouter.route('/profile-photo').get(profilePhoto)


// admin sidebar routes
adminRouter.route('/admin').get(adminDashboard)
adminRouter.route('/admin/all-doctors').get(adminDeleteDoctors)
adminRouter.route('/admin/approve-doctors').get(adminApproveDoctors)
adminRouter.route('/admin/add-specialites').get(adminAddSpecialites)

// add specialties in admin panel
adminRouter.route('/get-specialties').get(getSpecialties);
adminRouter.route('/delete-specialty').post(deleteSpecialty);
adminRouter.route('/get-new-specialties').get(getNewSpecialties);
adminRouter.route('/add-specialty').post(addNewSpecialties);


// approve doctor panel in admin panel
adminRouter.route('/individual-doctor/:id').get(individualDoctorRend);
adminRouter.route('/individual-doctor-details/:id').get(individualDoctor);
adminRouter.route('/approve-doctor/:id').get(approveDoctor);
adminRouter.route('/reject-doctor/:id').get(rejectDoctor);


// Display all patient and search patient
adminRouter.route('/admin/get-all-patient').get(getAllPatients);
adminRouter.route('/admin/all-patient').get(displayAllPatient);
adminRouter.route('/admin/display-search-patient/:searchedName').get(searchPatientByName);

// patient appointment details 
adminRouter.route('/admin/patient-appointment/:patient_id').get(patientAllAppointment);
adminRouter.route('/admin/get-patient-appointment/:patient_id').get(getPatientAllAppointment);
adminRouter.route('/admin/patient-appointment/:patient_id/:slot_id').get(appointmentDetails);


// all doctor list in admin panel
adminRouter.route('/get-all-doctors').get(getAllDoctors);
adminRouter.route('/delete-doctor/:id').get(deleteDoctor);


adminRouter.route('/admin/all-patient').get(displayAllPatient);
adminRouter.route('/admin/display-search-patient/:searchedName').get(searchPatientByName);
adminRouter.route('/admin/patient-appointment/:patient_id').get(patientAllAppointment);

// ADMIN dashboard api 
adminRouter.route('/getDashboardStatus').get(dashboardStatus);


module.exports = { adminRouter }