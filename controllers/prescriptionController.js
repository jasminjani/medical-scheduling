const conn = require("../config/dbConnection");
const jwt = require("jsonwebtoken");
let PDFDocument = require("pdfkit");

exports.createPrescription = async (req, res) => {
  try {
    // const decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decode);

    const { doctor_id, patient_id, prescription, diagnoses } = req.body;

    let query = `INSERT INTO prescriptions(doctor_id,patient_id,prescription,diagnoses) values (?,?,?,?)`;
    let result = await conn.query(query, [
      doctor_id,
      patient_id,
      prescription,
      diagnoses,
    ]);
    res.send(result);
    res.json({
      msg: "insertion in pescriptions completed",
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
    let id = req.params.patient_id;

    let result2 = await conn.query(
      `select count(*) as count from prescriptions where patient_id=?`,
      [id]
    );
    let count = result2[0][0].count;

    let query = `select prescriptions.created_at,fname,lname,doctor_id from prescriptions join users on prescriptions.doctor_id = users.id where patient_id=?`;
    let result = await conn.query(query, [id]);
    return res.status(200).json({ success: true, message: result, count });

    // let query = `select prescription from prescriptions where patient_id=?`;
    // console.log(query);
    // let result=await conn.query(query,[id]);

    // for(let i=0;i<count;i++){
    //   console.log(result[0][i].prescription+"prescriptionnn");
    // }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.generatePDF = async (req, res) => {
  let patient_id = req.query.patient_id;
  let doctor_id = req.query.doctor_id;
  let created_at = req.query.created_at;
  let appointment_date = created_at.toString().slice(0, 10);

  try {
    let doc = new PDFDocument();

    let query1 = `select prescription,fname,lname from prescriptions join users on prescriptions.patient_id=users.id where patient_id=? && doctor_id=? && prescriptions.created_at=?`;
    let query2 = `select fname,lname from prescriptions join users on prescriptions.doctor_id = users.id where patient_id=? && doctor_id=? && prescriptions.created_at=?`;
    let [result1] = await conn.query(query1, [
      patient_id,
      doctor_id,
      created_at,
    ]);
    let [result2] = await conn.query(query2, [
      patient_id,
      doctor_id,
      created_at,
    ]);

    let patient_name = result1[0].fname + " " + result1[0].lname;
    let doctor_name = result2[0].fname + " " + result2[0].lname;

    res.setHeader(
      "Content-disposition",
      'attachment; filename="prescription.pdf'
    );
    res.setHeader("Content-type", "application/pdf");

    let str = `
    Appointment Date:${appointment_date}  

    Patient Name:${patient_name}

    Doctor_name:${doctor_name}

    Prescription:

    ${result1[0].prescription}
    `;
    doc.moveDown().text(str);

    doc.pipe(res);
    doc.end();

    res.send();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPrescriptionOfDoctor = async (req, res) => {
  try {
    let id = req.params.doctor_id;

    let [result] = await conn.query(
      `select count(*) as count from prescriptions where doctor_id=?`,
      [id]
    );
    let count = result[0].count;
    let query = `select prescriptions.created_at,fname,lname,doctor_id from prescriptions join users on prescriptions.patient_id= users.id where doctor_id=?`;
    let result2 = await conn.query(query, [id]);
    return res.status(200).json({ success: true, message: result2, count });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// id, doctor_id, patient_id, prescription, diagnoses, created_at, updated_at;
