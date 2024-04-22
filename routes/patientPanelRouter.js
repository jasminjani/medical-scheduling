const express = require('express');
const passport = require('passport')
const { patientDashboard, patientStatus } = require('../controllers/patientModule/patientDashboardControllers');

const patientRouter = express.Router();
patientRouter.use(passport.authenticate('jwt', { session: false, failureRedirect: '/login' }))


patientRouter.route('/patient').get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), patientDashboard)
patientRouter.route('/patient-status/:id').get(passport.authenticate('jwt', { session: false, failureRedirect: "/login" }), patientStatus)




module.exports = patientRouter;