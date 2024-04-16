const conn = require("../config/dbConnection");

exports.patientAllAppointment = async (req, res) => {
  try {

    const { patient_id } = req.params;

    const sql = `SELECT users.id, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group FROM users JOIN patient_details ON users.id = patient_details.patient_id WHERE users.id = ?`;
    const [patientDetails] = await conn.query(sql, [patient_id])
    // await console.log(patientDetails);

    // const sql2 = ``;

    res.render('pages/adminPanel/patientAllAppointment', { patientDetails: patientDetails });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};