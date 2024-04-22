const express = require('express');
const passport = require('passport')
const { patientDashboard } = require('../controllers/patientModule/patientDashboardControllers');
const {isPatient} = require('../middlewares/authMiddleware')
const patientRouter = express.Router();
patientRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }))


patientRouter.route('/patient').get(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}),isPatient,patientDashboard)




module.exports = patientRouter;