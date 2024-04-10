const express = require("express");
const router = express.Router();
const { createPrescription,getPrescriptionOfUser } = require("../controllers/prescriptionController");


router.route("/createprescription/").post(createPrescription);


router.route("/getprescriptionofuser/:patient_id").get(getPrescriptionOfUser);



module.exports = router;
