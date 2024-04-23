const conn = require("../config/dbConnection");
const jwt = require("jsonwebtoken");
let PDFDocument = require("pdfkit");

exports.home = async (req, res) => {
  try {
    let {patient_id,booking_id}=req.params;
    return res.render("pages/Prescription/createPrescription.ejs",{patient_id,booking_id});
  } catch (error) {
    console.log(error.message);
  }
};

exports.allPatientPriscription = async (req, res) => {
  try {
    return res.render("pages/Prescription/prescriptionOfAllPatient.ejs");
  } catch (error) {
    console.log(error.message);
  }
};

exports.showDetails = async (req, res) => {
  try {
    // A7 params patient_id
    const id = req.params.patient_id;
    const query = `SELECT
    users.id,
    users.fname,
    users.lname,
    users.email,
    users.phone,
    users.gender,
    users.dob,
    users.address,
    COALESCE(patient_details.blood_group, 'Not Specified') AS blood_group
FROM
    users
LEFT JOIN
    patient_details ON users.id = patient_details.patient_id
WHERE
    users.id = ?;`;
    const [result] = await conn.query(query, [id]);
    // console.log(result);
    res.json({ result });
    // res.render("pages/createPrescription.ejs", { result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const { patient_id, prescription, diagnosis,booking_id } = req.body;

    const query = `INSERT INTO prescriptions(doctor_id,patient_id,prescription,diagnoses,booking_id) values (?,?,?,?,?)`;

    if(prescription && diagnosis){
      let result = await conn.query(query, [
        doctor_id,
        patient_id,
        prescription,
        diagnosis,
        booking_id
      ]);
      const insert_id = JSON.stringify(result[0].insertId);
      res.json({
        msg: "Prescription Added Successfully",
        insert_id,
      });
    }
    else{
      res.json({
        msg:"Please enter diagnosis & prescription!"
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const id = req.params.id;
    let query = `select concat(users.fname," ",users.lname) as patient_name,convert(prescriptions.created_at,date),diagnoses,prescription from prescriptions join users on prescriptions.patient_id= users.id where prescriptions.id=?`;
    let [result] = await conn.query(query, [id]);
    res.status(200).json({success:true,result: result});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    console.log("in updateprescription");
    const id = req.params.id;
    const { prescription, diagnosis } = req.body;
    let query = `UPDATE prescriptions SET diagnoses=?,prescription=? where id=? `;
    let result = await conn.query(query, [diagnosis, prescription, id]);
    res.json({
      msg: "Updation in prescriptions completed"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPrescriptionOfUser = async (req, res) => {
  try {
    const id = req.user.id;

    const query = `select prescriptions.created_at,prescriptions.id,prescriptions.diagnoses,fname,lname,doctor_id from prescriptions join users on prescriptions.doctor_id = users.id where patient_id=?`;
    const result = await conn.query(query, [id]);
    return res.status(200).json({ success: true, message: result});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPrescriptionOfDoctor = async (req, res) => {
  try {
    const id = req.user.id;

    const query = `select prescriptions.created_at,prescriptions.diagnoses,prescriptions.id,concat(users.fname," ",users.lname) as patient_name from prescriptions join users on prescriptions.patient_id= users.id where doctor_id=? order by prescriptions.created_at desc`;
    const result2 = await conn.query(query, [id]);
    return res.status(200).json({ success: true, result:result2});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }0
};

exports.editPrescriptionHome=async (req,res)=>{
  try{
    const id=req.params.id;
    return res.render('pages/Prescription/editPrescription.ejs',{id})
  }catch(error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// id, doctor_id, patient_id, prescription, diagnoses, created_at, updated_at;
