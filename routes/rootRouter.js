const express = require('express');
const doctorRouter = require('./doctorRouter');
const hospitalRouter = require('./hospitalRoute');
const prescriptionRouter = require('./prescriptionRoutes');
const userRouter = require('./userRoute');
const nearByDoctorsRouter = require('./nearByDoctorsRouter');
const router = express.Router();
const { demoHomeController } = require('../controllers/demoHomecontroller');
const { adminRouter } = require('./adminPanelRouter');
const patientRouter = require('./patientPanelRouter');

router.use("/", userRouter);
router.use("/", doctorRouter);
router.use("/", hospitalRouter);
router.use("/", prescriptionRouter);
router.use('/', nearByDoctorsRouter);
router.use('/', adminRouter);
router.use('/', patientRouter)


router.get('/demo', demoHomeController);

module.exports = router;