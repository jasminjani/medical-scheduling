const express = require('express');
const { getSpecialties, deleteSpecialty, getNewSpecialties, addNewSpecialties } = require('../controllers/adminModule/adminGetSpecialtiesController');
const { individualDoctor, pendingDoctos, approveDoctor, rejectDoctor, getAllDoctors, deleteDoctor } = require('../controllers/adminModule/adminApproveDocController');
const { displayAllPatient, searchPatientByName } = require('../controllers/adminPanelPatientController');
const { patientAllAppointment } = require('../controllers/patientAllAppointController');
const { adminDeleteDoctors, adminApproveDoctors, adminGetAllPatients, adminAddSpecialites, adminDashboard } = require('../controllers/adminModule/adminPanelController')
const adminRouter = express.Router()

// admin sidebar routes
adminRouter.route('/admin').get(adminDashboard)
adminRouter.route('/admin/all-doctors').get(adminDeleteDoctors)
adminRouter.route('/admin/approve-doctors').get(adminApproveDoctors)
adminRouter.route('/admin/all-patient').get(adminGetAllPatients)
adminRouter.route('/admin/add-specialites').get(adminAddSpecialites)

// add specialties in admin panel
adminRouter.route('/get-specialties').get(getSpecialties);
adminRouter.route('/delete-specialty').post(deleteSpecialty);
adminRouter.route('/get-new-specialties').get(getNewSpecialties);
adminRouter.route('/add-specialty').post(addNewSpecialties);


// approve doctor panel in admin panel
adminRouter.route('/individual-doctor/:id').get(individualDoctor);
adminRouter.route('/get-pending-doctor').get(pendingDoctos);
adminRouter.route('/approve-doctor/:id').get(approveDoctor);
adminRouter.route('/reject-doctor/:id').get(rejectDoctor);


adminRouter.route('/admin/all-patient').get(displayAllPatient);
adminRouter.route('/admin/display-search-patient/:searchedName').get(searchPatientByName);
adminRouter.route('/admin/patient-appointment/:patient_id').get(patientAllAppointment);


// all doctor list in admin panel
adminRouter.route('/get-all-doctors').get(getAllDoctors);
adminRouter.route('/delete-doctor/:id').get(deleteDoctor);



module.exports = { adminRouter }