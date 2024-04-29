const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter')
const doctorRouter = require('./doctorRouter')
const adminRouter = require('./adminRouter')
const patientRouter = require('./patientRouter');
const { getCityCombo, allSpecialities } = require('../controllers/doctorController');

router.use("/", authRouter);
router.use("/doctor", doctorRouter);
router.use('/admin', adminRouter);
router.use('/patient', patientRouter)

router.route("/cityCombo").get(getCityCombo);
router.route("/specialities").get(allSpecialities);

router.use("*",(req,res)=>{
  return res.render('common/404')
})
module.exports = router;