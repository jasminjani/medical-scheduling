const conn = require("../config/dbConnection");
const jwt = require("jsonwebtoken");
let PDFDocument = require("pdfkit");

exports.showDetails = async (req, res) => {
  try {
    const id = "5";
    const query = `select users.id,fname,lname,email,phone,gender,dob,address,patient_details.blood_group from users join patient_details on users.id=patient_details.patient_id where patient_id=?`;
    const [result] = await conn.query(query, [id]);
    res.render("pages/createPrescription.ejs", {
      id: result[0].id,
      firstname: result[0].fname,
      lastname: result[0].lname,
      email: result[0].email,
      contact_number: result[0].phone,
      gender: result[0].gender,
      dob: result[0].dob,
      address: result[0].address,
      blood_group: result[0].blood_group,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    // const decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decode);
    const doctor_id = "3";
    const { patient_id, prescription, diagnosis } = req.body;

    const query = `INSERT INTO prescriptions(doctor_id,patient_id,prescription,diagnoses) values (?,?,?,?)`;
    let result = await conn.query(query, [
      doctor_id,
      patient_id,
      prescription,
      diagnosis,
    ]);
    const insert_id = JSON.stringify(result[0].insertId);
    console.log(insert_id);
    console.log("insertion in prescriptions completed");
    res.json({
      msg: "insertion in prescriptions completed",
      insert_id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.updateDetails = async (req, res) => {
//   console.log("in updateDetails");
//   try {
//     const id = req.params.patient_id;
//     console.log(id);
//     let query = `select * from prescriptions where patient_id=?`;
//     let result = await conn.query(query, [id]);
//     res.send(result);
//     res.json({
//       msg: result,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.updatePrescription = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { prescription, diagnoses } = req.body;
//     let query = `UPDATE prescriptions SET diagnoses=?,prescription=? where patient_id=? `;
//     let result = await conn.query(query, [diagnoses, prescription, id]);
//     res.send(result);
//     res.json({
//       msg: "Updation in pescriptions completed",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.getPrescriptionOfUser = async (req, res) => {
  try {
    const id = req.params.patient_id;

    const result2 = await conn.query(
      `select count(*) as count from prescriptions where patient_id=?`,
      [id]
    );
    const count = result2[0][0].count;

    const query = `select prescriptions.created_at,fname,lname,doctor_id from prescriptions join users on prescriptions.doctor_id = users.id where patient_id=?`;
    const result = await conn.query(query, [id]);
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
  const patient_id = req.query.patient_id;
  const doctor_id = req.query.doctor_id;
  const created_at = req.query.created_at;
  const appointment_date = created_at.toString().slice(0, 10);

  try {
    let doc = new PDFDocument();

    const query = `select prescriptions.prescription,
        concat(users_patient.fname," ",users_patient.lname) as patient_name,
        concat(users_doctor.fname," ",users_doctor.lname) as doctor_name
        from prescriptions 
        join users as users_patient on prescriptions.patient_id=users_patient.id 
        join users as users_doctor on prescriptions.doctor_id = users_doctor.id  
        where patient_id='5' && doctor_id='3' && prescriptions.created_at='2024-04-10 15:59:40'`;

    const [result] = await conn.query(query, [
      patient_id,
      doctor_id,
      created_at,
    ]);
    const patient_name = result[0].patient_name;
    const doctor_name = result[0].doctor_name;

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

    ${result[0].prescription}
    `;
    doc.moveDown().text(str);

    doc.pipe(res);
    doc.end();

    res.send();
    console.log("pdf generated successfully");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPrescriptionOfDoctor = async (req, res) => {
  try {
    const id = req.params.doctor_id;

    const [result] = await conn.query(
      `select count(*) as count from prescriptions where doctor_id=?`,
      [id]
    );
    const count = result[0].count;
    const query = `select prescriptions.created_at,fname,lname,doctor_id from prescriptions join users on prescriptions.patient_id= users.id where doctor_id=?`;
    const result2 = await conn.query(query, [id]);
    return res.status(200).json({ success: true, message: result2, count });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// id, doctor_id, patient_id, prescription, diagnoses, created_at, updated_at;
