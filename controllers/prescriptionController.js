const conn=require("../config/dbConnection")

exports.createPrescription=async (req,res)=>{

    try {
        console.log("Helloooo");
        const { doctor_id, patient_id, prescription, diagnoses } = req.body;

        console.log(doctor_id,patient_id, prescription, diagnoses);
        let query = `INSERT INTO prescriptions SET doctor_id=?,patient_id=?,prescription=?,diagnoses=?`;
        let result=await conn.query(query,[doctor_id,patient_id, prescription, diagnoses]);
        console.log("insertion in pescriptions completed");

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

        id=req.params.id;
        console.log(id);
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