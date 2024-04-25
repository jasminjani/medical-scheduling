const express = require('express');
const router = express.Router();
const { demoHomeController } = require('../controllers/demoHomecontroller');
const authRouter = require('./authRouter')
const doctorRouter = require('./doctorRouter')
const adminRouter = require('./adminRouter')
const patientRouter = require('./patientRouter')

router.use("/", authRouter);
router.use("/", doctorRouter);
router.use('/admin', adminRouter);
router.use('/patient', patientRouter)


router.get('/demo', demoHomeController);

module.exports = router;