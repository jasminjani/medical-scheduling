const express = require('express');
const doctorRouter = require('./doctorRouter');
const doctorSpecialitiesRouter = require('./doctorSpecialitiesRouter');
const hospitalRouter = require('./hospitalRoute');
const prescriptionRouter = require('./prescriptionRoutes');
const userRouter = require('./userRoute');
const nearByDoctorsRouter = require('./nearByDoctorsRouter');
const router = express.Router();
const { demoHomeController } = require('../controllers/demoHomecontroller');
const { adminRouter } = require('./adminPanelRouter');

router.use("/", userRouter);
router.use("/", doctorRouter);
router.use("/", doctorSpecialitiesRouter);
router.use("/", hospitalRouter);
router.use("/", prescriptionRouter);
router.use('/', nearByDoctorsRouter);
router.use('/',adminRouter);


router.get('/', demoHomeController);

module.exports = router;