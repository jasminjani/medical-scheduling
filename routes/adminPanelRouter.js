const express = require('express');
const { getSpecialties, deleteSpecialty, getNewSpecialties, addNewSpecialties } = require('../controllers/adminModule/adminGetSpecialtiesController');

const { individualDoctor, approveDoctor, rejectDoctor, getAllDoctors, deleteDoctor, showDoctorDetail,showDoctorDetailRend,individualDoctorRend } = require('../controllers/adminModule/adminApproveDocController');

const { displayAllPatient, searchPatientByName, getAllPatients } = require('../controllers/adminModule/adminPanelPatientController');
const { patientAllAppointment, appointmentDetails, getPatientAllAppointment } = require('../controllers/adminModule/patientAllAppointController');
const { adminDeleteDoctors, adminApproveDoctors, adminAddSpecialites, adminDashboard } = require('../controllers/adminModule/adminPanelController');
const passport = require('passport');
const { profilePhoto } = require('../controllers/adminModule/profilePhotoController');
const { dashboardStatus } = require('../controllers/adminModule/adminDashboardController');
const { isAdmin } = require('../middlewares/authMiddleware')

const adminRouter = express.Router()

adminRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }))

// profile photo
adminRouter.route('/profile-photo').get(profilePhoto)


// admin sidebar routes
adminRouter.route('/admin').get(isAdmin,adminDashboard)
adminRouter.route('/admin/all-doctors').get(isAdmin,adminDeleteDoctors)
adminRouter.route('/admin/approve-doctors').get(isAdmin,adminApproveDoctors)
adminRouter.route('/admin/add-specialites').get(isAdmin,adminAddSpecialites)

// add specialties in admin panel
adminRouter.route('/admin/get-specialties').get(isAdmin,getSpecialties);
adminRouter.route('/admin/delete-specialty').post(isAdmin,deleteSpecialty);
adminRouter.route('/admin/get-new-specialties').get(isAdmin,getNewSpecialties);
adminRouter.route('/admin/add-specialty').post(isAdmin,addNewSpecialties);


// approve doctor panel in admin panel


adminRouter.route('/individual-doctor/:id').get(isAdmin,individualDoctorRend);
adminRouter.route('/individual-doctor-details/:id').get(isAdmin,individualDoctor);
adminRouter.route('/show-doctor-deatil/:id').get(isAdmin,showDoctorDetailRend);
adminRouter.route('/show-doctor-details/:id').get(isAdmin,showDoctorDetail);
adminRouter.route('/approve-doctor/:id').get(isAdmin,approveDoctor);
adminRouter.route('/reject-doctor/:id').get(isAdmin,rejectDoctor);




// Display all patient and search patient
adminRouter.route('/admin/get-all-patient').get(isAdmin,getAllPatients);
adminRouter.route('/admin/all-patient').get(isAdmin,displayAllPatient);
adminRouter.route('/admin/display-search-patient/:searchedName').get(isAdmin,searchPatientByName);

// patient appointment details 
adminRouter.route('/admin/patient-appointment/:patient_id').get(isAdmin,patientAllAppointment);
adminRouter.route('/admin/get-patient-appointment/:patient_id').get(isAdmin,getPatientAllAppointment);
adminRouter.route('/admin/patient-appointment/:patient_id/:slot_id').get(isAdmin,appointmentDetails);


// all doctor list in admin panel
adminRouter.route('/get-all-doctors').get(isAdmin,getAllDoctors);
adminRouter.route('/delete-doctor/:id').get(isAdmin,deleteDoctor);


adminRouter.route('/admin/all-patient').get(isAdmin,displayAllPatient);
adminRouter.route('/admin/display-search-patient/:searchedName').get(isAdmin,searchPatientByName);
adminRouter.route('/admin/patient-appointment/:patient_id').get(isAdmin,patientAllAppointment);

// ADMIN dashboard api 
adminRouter.route('/getDashboardStatus').get(isAdmin,dashboardStatus);


module.exports = { adminRouter }