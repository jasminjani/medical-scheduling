const express = require("express");
const { createPrescription,getPrescriptionOfUser } = require("../controllers/prescriptionController");
const router = express.Router();


router.route("/createprescription/").post(createPrescription);


router.route("/getprescriptionofuser/:id").get(getPrescriptionOfUser);



module.exports = router;
