const express = require("express");
const passport = require('passport');
const router = express.Router();
const {
  createPrescription,
  getPrescriptionOfUser,
  getPrescriptionOfDoctor,
  generatePDF,
  updatePrescription,
  updateDetails,
  showDetails,
  home,
  allPatientPriscription,
  editPrescriptionHome
} = require("../controllers/prescriptionController");

router.use(passport.authenticate('jwt',{session:false,failureRedirect:"/login"}));

router.route("/createprescription").post(createPrescription);

router.route("/updatedetails/:id").get(updateDetails);

router.route("/updatePrescription/:id").post(updatePrescription);

router.route("/getprescriptionofuser").get(getPrescriptionOfUser);

router.route("/getprescriptionofdoctor").get(getPrescriptionOfDoctor);

router.route("/generatePDFofprescripton/:id").get(generatePDF);

router.route("/createprescription").get(showDetails);

router.route("/prescription").get(home);

router.route("/prescriptiondetails").get(allPatientPriscription);

router.route("/editprescription/:id").get(editPrescriptionHome);

module.exports = router;
