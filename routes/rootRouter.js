const express = require('express');
const paymentRouter = require('./paymentsRouter');
const doctorRouter = require('./doctorRouter');
const doctorSpecialitiesRouter = require('./doctorSpecialitiesRouter');
const hospitalRouter = require('./hospitalRoute');
const prescriptionRouter = require('./prescriptionRoutes');
const userRouter = require('./userRoute');
const router = express.Router();

router.use('/', paymentRouter);
router.use("/api", userRouter);
router.use("/", doctorRouter);
router.use("/", doctorSpecialitiesRouter);
router.use("/", hospitalRouter);
router.use("/", prescriptionRouter);

module.exports = router;