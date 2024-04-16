const express = require('express')
const { adminPanelControllers } = require('../controllers/adminPanelController');
const { getSpecialties, deleteSpecialty, getNewSpecialties, addNewSpecialties } = require('../controllers/adminGetSpecialtiesController');
const { pendingDoctos, individualDoctor } = require('../controllers/adminApproveDoc');
const { displayAllPatient, searchPatientByName } = require('../controllers/adminPanelPatientController');
const { patientAllAppointment } = require('../controllers/patientAllAppointController');
const adminRouter = express.Router()

adminRouter.route('/admin').get(adminPanelControllers);
adminRouter.route('/get-specialties').get(getSpecialties);
adminRouter.route('/delete-specialty').post(deleteSpecialty);
adminRouter.route('/get-new-specialties').get(getNewSpecialties);
adminRouter.route('/add-specialty').post(addNewSpecialties);


adminRouter.route('/individual-doctor/:id').get(individualDoctor);
adminRouter.route('/get-pending-doctor').get(pendingDoctos);


adminRouter.route('/admin/all-patient').get(displayAllPatient);
adminRouter.route('/admin/display-search-patient/:searchedName').get(searchPatientByName);
adminRouter.route('/admin/patient-appointment/:patient_id').get(patientAllAppointment);


module.exports = { adminRouter }