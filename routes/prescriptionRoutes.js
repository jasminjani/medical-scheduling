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
} = require("../controllers/prescriptionController");

router.route("/createprescription").post(createPrescription);

// router.route("/updatedetails/:patient_id").get(updateDetails);

// router.route("/updatePrescription").post(updatePrescription);

router.route("/getprescriptionofuser/:patient_id").get(getPrescriptionOfUser);

router
  .route("/getprescriptionofdoctor/:doctor_id")
  .get(getPrescriptionOfDoctor);

router.route("/generatePDFofprescripton").get(generatePDF);

router.route("/createprescription").get(showDetails);

module.exports = router;
