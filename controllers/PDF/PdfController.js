// const {generatePDF}=require("../prescriptionController");
const conn = require("../../config/dbConnection");
let PDFDocument = require("pdfkit");

exports.generatePDF = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const query = `select prescriptions.prescription,prescriptions.diagnoses,prescriptions.created_at,
        concat(users_patient.fname," ",users_patient.lname) as patient_name,
        concat(users_doctor.fname," ",users_doctor.lname) as doctor_name,
        users_patient.email as patient_email,
        users_patient.gender as patient_gender,
        users_patient.dob as patient_dob,
        users_patient.phone as patient_phone,
        users_patient.address as patient_address
        from prescriptions 
        join users as users_patient on prescriptions.patient_id=users_patient.id 
        join users as users_doctor on prescriptions.doctor_id = users_doctor.id  
        where prescriptions.id = ?`;

    const [result] = await conn.query(query,[id]);
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

    let str = `
    Appointment Date:${appointment_date}  

    Patient Name:${patient_name}

    Doctor_name:${doctor_name}

    Diagnosis:${diagnosis}

      ${result[0].prescription}
    `;

    // doc.image('public/assets/logo.png',{fit: [100, 80],align: 'center',valign: 'center'});
    // doc.moveDown(8);
    // doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Appointment Date:'+" "+`${appointment_date}`);
    // doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Patient Name:'+" "+`${patient_name}`);
    // doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Doctor Name:'+" "+`${doctor_name}`);
    // doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Diagnosis:'+" "+`${diagnosis}`);
    // doc.moveDown().font('Times-Roman').fontSize(14).fillColor('#224763').text('Prescription:'+" "+`${prescription}`);

    let doc = new PDFDocument({ margin: 50 });

    //header
	  doc.image('public/assets/logo.png', 50, 45, { width: 50 })
		.fillColor('#444444')
    .moveDown()
		.fontSize(22)
		.text('PRESCRIPTION', 80, 65, { align: 'center' })
		.moveDown();

    doc.image('public/assets/hrline4.png',0,100,{width:800,height:20})
    .moveDown(2)
    .fontSize(15)
    .fillColor('#224763')
    .text('Patient Information')
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
    .moveDown(2)
    .fontSize(12)
    .fillColor('black')
    .text(result[0].prescription)
    .moveDown(1)
    .fontSize(13)
    .fillColor('#224763')
    .text(('Appointment Date:'+" "+appointment_date),350,130)
    .moveDown(1)
    .fontSize(11)
    .fillColor('black')
    .text(('DOB:'+" "+result[0].patient_dob),300,200)
    .moveDown(1)
    .text('Gender:'+" "+result[0].patient_gender)
    





    //footer
	  doc.fontSize(12).text(
		'Thank you for visiting us.',
		50,
		730,
		{ align: 'center', width: 500 },
	  );
  

    doc.pipe(res);
    doc.end();



  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};