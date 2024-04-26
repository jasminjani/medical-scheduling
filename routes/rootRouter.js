const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter')
const doctorRouter = require('./doctorRouter')
const adminRouter = require('./adminRouter')
const patientRouter = require('./patientRouter')

router.use("/", authRouter);
router.use("/doctor", doctorRouter);
router.use('/admin', adminRouter);
router.use('/patient', patientRouter)



module.exports = router;