const express = require('express');
const passport = require('passport')
const { patientDashboard, patientViewProfile, patientViewProfileData, patientProfileUpdateData, getpatientProfileUpdate, postPatientProfileUpdate, patientDetails, addPatientDetails, patientStatus } = require('../controllers/patientModule/patientDashboardControllers');
const patientRouter = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const { isPatient } = require('../middlewares/authMiddleware');
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });

// all patient router use
patientRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), isPatient)


patientRouter.route('/patient').get(patientDashboard)
patientRouter.route('/patient-status/:id').get(patientStatus);
patientRouter.route('/patient-details').post(patientDetails)
patientRouter.route('/add-patient-details').post(fileUpload.single('medicalHistory'), addPatientDetails)


// yash babaria
patientRouter.route('/viewPatientProfile').get(patientViewProfile)
patientRouter.route('/viewPatientProfileData').get(patientViewProfileData)
patientRouter.route('/patientProfileUpdate').get(getpatientProfileUpdate)
patientRouter.route('/patientProfileUpdate').post(imgUpload.single("profile_picture"), postPatientProfileUpdate)
patientRouter.route('/patientProfileUpdateData').get(patientProfileUpdateData)
module.exports = patientRouter;