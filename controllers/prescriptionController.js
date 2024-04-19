const conn = require("../config/dbConnection");
const jwt = require("jsonwebtoken");
let PDFDocument = require("pdfkit");

exports.home = async (req, res) => {
  try {
    return res.render("pages/Prescription/createPrescription.ejs");
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
    const id = "5";
    const query = `select users.id,fname,lname,email,phone,gender,dob,address,patient_details.blood_group from users join patient_details on users.id=patient_details.patient_id where patient_id=?`;
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
    // const decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decode);
    console.log(req.user);
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
    console.log(id,prescription,diagnosis);
    let query = `UPDATE prescriptions SET diagnoses=?,prescription=? where id=? `;
    let result = await conn.query(query, [diagnosis, prescription, id]);
    res.json({
      msg: "Updation in pescriptions completed"
    });
    console.log("completed");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPrescriptionOfUser = async (req, res) => {
  try {
    const id = "5";

    const result2 = await conn.query(
      `select count(*) as count from prescriptions where patient_id=?`,
      [id]
    );
    const count = result2[0][0].count;

    const query = `select prescriptions.created_at,prescriptions.id,prescriptions.diagnoses,fname,lname,doctor_id from prescriptions join users on prescriptions.doctor_id = users.id where patient_id=?`;
    const result = await conn.query(query, [id]);
    return res.status(200).json({ success: true, message: result, count });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const id = req.params.id;

    let doc = new PDFDocument();

    const query = `select prescriptions.prescription,prescriptions.diagnoses,prescriptions.created_at,
        concat(users_patient.fname," ",users_patient.lname) as patient_name,
        concat(users_doctor.fname," ",users_doctor.lname) as doctor_name
        from prescriptions 
        join users as users_patient on prescriptions.patient_id=users_patient.id 
        join users as users_doctor on prescriptions.doctor_id = users_doctor.id  
        where prescriptions.id=${id}`;

    const [result] = await conn.query(query);
    const patient_name = result[0].patient_name;
    const doctor_name = result[0].doctor_name;
    const prescription = result[0].prescription;
    const diagnosis = result[0].diagnoses;
    const appointment_date = result[0].created_at.toString().slice(0, 10);

    res.setHeader(
      "Content-disposition",
      `attachment; filename=prescription-${patient_name}.pdf`
    );
    res.setHeader("Content-type", "application/pdf");

    // let str = `
    // Appointment Date:${appointment_date}  

    // Patient Name:${patient_name}

    // Doctor_name:${doctor_name}

    // Diagnosis:${diagnosis}

<<<<<<< HEAD
    Prescription:${prescription}
=======
    // Prescription:
>>>>>>> develop

    //   ${result[0].prescription}
    // `;

    doc.image('public/assets/logo.png',{fit: [100, 80],align: 'center',valign: 'center'});
    doc.moveDown(8);
    doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Appointment Date:'+" "+`${appointment_date}`);
    doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Patient Name:'+" "+`${patient_name}`);
    doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Doctor Name:'+" "+`${doctor_name}`);
    doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Diagnosis:'+" "+`${diagnosis}`);
    doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Prescription:');
    doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text(`${result[0].prescription}`);

    doc.pipe(res);
    doc.end();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPrescriptionOfDoctor = async (req, res) => {
  try {
    const id = "3";

    const [result] = await conn.query(
      `select count(*) as count from prescriptions where doctor_id=?`,
      [id]
    );
    const count = result[0].count;
    const query = `select prescriptions.created_at,prescriptions.diagnoses,prescriptions.id,concat(users.fname," ",users.lname) as patient_name from prescriptions join users on prescriptions.patient_id= users.id where doctor_id=? order by prescriptions.created_at`;
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
