const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getPrescriptionOfUser,
  getPrescriptionOfDoctor,
  generatePDF,
} = require("../controllers/prescriptionController");

router.route("/createprescription/").post(createPrescription);

router.route("/getprescriptionofuser/:patient_id").get(getPrescriptionOfUser);

router
  .route("/getprescriptionofdoctor/:doctor_id")
  .get(getPrescriptionOfDoctor);

router.route("/generatePDFofprescripton").get(generatePDF);

module.exports = router;
