const conn=require("../config/dbConnection");
const jwt = require("jsonwebtoken");

exports.createPrescription=async (req,res)=>{

    try {
        console.log("Helloooo");
        // const decode = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decode);

        const { doctor_id, patient_id, prescription, diagnoses } = req.body;

        console.log(doctor_id,patient_id, prescription, diagnoses);
        let query = `INSERT INTO prescriptions(doctor_id,patient_id,prescription,diagnoses) values (?,?,?,?)`;
        let result=await conn.query(query,[doctor_id,patient_id, prescription, diagnoses]);
        res.json({
          msg: "insertion in pescriptions completed",
        });

    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }


}

exports.getPrescriptionOfUser=async (req,res)=>{
    try {
        id=req.params.patient_id;
        console.log(id);
        
        let result2 =await conn.query(`select count(*) as count from prescriptions where patient_id=?`,[id]);
        console.log(result2[0][0].count);

        let query = `select prescription from prescriptions where patient_id=?`;
        console.log(query);
        let result=await conn.query(query,[id]);
        console.log(result[0][0].prescription);
        console.log("Get Prescription");
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}

// id, doctor_id, patient_id, prescription, diagnoses, created_at, updated_at;