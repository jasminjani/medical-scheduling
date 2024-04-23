const express = require('express');
const passport = require('passport')
const { patientDashboard, patientViewProfile, patientViewProfileData, patientProfileUpdateData, getpatientProfileUpdate, postPatientProfileUpdate, patientDetails, addPatientDetails } = require('../controllers/patientModule/patientDashboardControllers');
const patientRouter = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });
patientRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }))


patientRouter.route('/patient').get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),patientDashboard)

patientRouter.route('/patient-details').post(passport.authenticate('jwt',{session:false,failureRedirect:'/login'}),patientDetails)
patientRouter.route('/add-patient-details').post(passport.authenticate('jwt',{session:false,failureRedirect:'/login'}),fileUpload.single('medicalHistory'),addPatientDetails)


// yash babaria
patientRouter.route('/viewPatientProfile').get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), patientViewProfile)
patientRouter.route('/viewPatientProfileData').get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), patientViewProfileData)
patientRouter.route('/patientProfileUpdate').get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), getpatientProfileUpdate)
patientRouter.route('/patientProfileUpdate').post(imgUpload.single("profile_picture"), passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), postPatientProfileUpdate)
patientRouter.route('/patientProfileUpdateData').get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }),patientProfileUpdateData)
module.exports = patientRouter;