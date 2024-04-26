const conn = require("../config/dbConnection");
let PDFDocument = require("pdfkit");
const logger = require("../utils/pino");

exports.generatePDF = async (req, res) => {
  try {
    const id = req.params.id;
    logger.info(id);

    const query = `select prescriptions.prescription,prescriptions.diagnoses,prescriptions.created_at,
        concat(users_patient.fname," ",users_patient.lname) as patient_name,
        concat(users_doctor.fname," ",users_doctor.lname) as doctor_name,
        users_patient.email as patient_email,
        users_patient.gender as patient_gender,
        users_patient.dob as patient_dob,
        users_patient.phone as patient_phone,
        users_patient.address as patient_address,
        dd.qualification as doctor_qualification,
        ch.name as clinic_name,
        ch.location as clinic_address
        from prescriptions 
        join users as users_patient on prescriptions.patient_id=users_patient.id
        join users as users_doctor on prescriptions.doctor_id = users_doctor.id
        join doctor_details as dd  on prescriptions.doctor_id = dd.doctor_id 
        join clinic_hospitals as ch on dd.hospital_id = ch.id
        where prescriptions.id = ?`;

    const [result] = await conn.query(query,[id]);
    const appointment_date = result[0].created_at.toString().slice(0, 10);

    res.setHeader(
      "Content-disposition",
      `attachment; filename=prescription-${result[0].patient_nametient_name}.pdf`
    );
    res.setHeader("Content-type", "application/pdf");

    let doc = new PDFDocument({ margin: 50 });

    //header
	  doc.image('public/assets/final-logo.png', 50, 42, { width: 70 })
		.fillColor('#444444')
    .moveDown()
		.fontSize(22)
		.text('PRESCRIPTION', 80, 65, { align: 'center' })
		.moveDown();

    //footer
    doc.image('public/assets/curved_line.png',10, 670, { width: 600,height:150})

    doc.image('public/assets/hrline4.png',0,100,{width:800,height:20})
    .moveDown(1)
    .fontSize(13)
    .fillColor('#224763')
    .text(('Appointment Date:'+" "+appointment_date),350,130)
    .moveDown(1)
    .fontSize(11)
    .fillColor('black')
    .text(('DOB:'+" "+result[0].patient_dob),300,195)
    .moveDown(1)
    .text('Gender:'+" "+result[0].patient_gender)
    .moveDown(2)
    .fontSize(15)
    .fillColor('#224763')
    .text('Patient Information',70,160)
    .moveDown(1)
    .fontSize(11)
    .fillColor('black')
    .text('Name:'+" "+result[0].patient_name)
    .moveDown(1)
    .text('Email:'+" "+result[0].patient_email)
    .moveDown(1)
    .text('Phone Number:'+" "+result[0].patient_phone)
    .moveDown(1)
    .text('Address:'+" "+result[0].patient_address)
    .moveDown(2)
    .fontSize(15)
    .fillColor('#224763')
    .text('Prescription:')
    .moveDown(1)
    .fontSize(12)
    .fillColor('black')
    .text(result[0].prescription)
    .moveDown(2)
    .fontSize(15)
    .fillColor('#224763')
    .text('Diagnosis:')
    .moveDown(1)
    .fontSize(12)
    .fillColor('black')
    .text(result[0].diagnoses)
    .moveDown(4)
    .fontSize(13)
    .fillColor('#224763')
    .text('Dr.'+result[0].doctor_name)
    .fontSize(10)
    .fillColor('#224763')
    .text(result[0].doctor_qualification)
    .moveDown(3)
    .fontSize(12)
    .fillColor('#224763')
    .text('Clinic Details:')
    .moveDown(1)
    .fontSize(10)
    .fillColor('#224763')
    .text(result[0].clinic_name)
    .moveDown(1)
    .fontSize(10)
    .fillColor('#224763')
    .text(result[0].clinic_address)


    //footer
    doc.image('public/assets/curved_line.png',10, 670, { width: 600,height:150})

    doc.pipe(res);
    doc.end();



  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};