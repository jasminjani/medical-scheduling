const express = require("express");
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
} = require("../controllers/prescriptionController");

router.route("/createprescription").post(createPrescription);

// router.route("/updatedetails/:patient_id").get(updateDetails);

// router.route("/updatePrescription").post(updatePrescription);

router.route("/getprescriptionofuser").get(getPrescriptionOfUser);

router.route("/getprescriptionofdoctor").get(getPrescriptionOfDoctor);

router.route("/generatePDFofprescripton/:id").get(generatePDF);

router.route("/createprescription").get(showDetails);

router.route("/home").get(home);

router.route("/allPatientPriscription").get(allPatientPriscription);

module.exports = router;
