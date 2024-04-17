const conn = require("../config/dbConnection");

exports.patientAllAppointment = async (req, res) => {
  try {

    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(500).json({
        success: false,
        message: "patient id not found"
      })
    }

    // try {
    const sql = `SELECT users.id, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group 
      FROM users JOIN patient_details ON users.id = patient_details.patient_id WHERE users.id = ?`;
    const [patientDetails] = await conn.query(sql, [patient_id]);
    // } catch (error) {
    //   return res.status(500).json({
    //     success: false,
    //     message: error.message
    //   })
    // }

    // try {
    const sql2 = `SELECT users.fname, users.lname, slot_bookings.slot_id, time_slots.doctor_id, specialities.speciality, time_slots.date
      FROM slot_bookings JOIN time_slots ON slot_bookings.slot_id = time_slots.id
      JOIN users ON time_slots.doctor_id = users.id 
      JOIN doctor_has_specialities ON time_slots.doctor_id = doctor_has_specialities.doctor_id 
      JOIN specialities ON doctor_has_specialities.speciality_id = specialities.id 
      where slot_bookings.patient_id = ?`;

    const [allAppointment] = await conn.query(sql2, [patient_id]);

    // } catch (error) {
    //   return res.status(500).json({
    //     success: false,
    //     message: error.message
    //   })
    // }

    res.render('pages/adminPanel/patientAllAppointment', { patientDetails: patientDetails, allAppointment: allAppointment });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};


exports.appointmentDetails = async (req, res) => {
  try {

    let { slot_id } = req.params;

    if (!slot_id) {
      return res.status(500).json({
        success: false,
        message: "slot id not found"
      })
    }

    const sql3 = `SELECT slot_bookings.patient_id, users.fname, users.lname, slot_bookings.slot_id, time_slots.doctor_id, specialities.speciality, clinic_hospitals.name, time_slots.date, time_slots.start_time, time_slots.end_time, prescriptions.prescription, prescriptions.diagnoses 
    FROM slot_bookings JOIN time_slots ON slot_bookings.slot_id = time_slots.id 
    JOIN doctor_has_specialities ON time_slots.doctor_id = doctor_has_specialities.doctor_id 
    JOIN specialities ON doctor_has_specialities.speciality_id = specialities.id 
    JOIN doctor_details ON time_slots.doctor_id = doctor_details.doctor_id 
    JOIN clinic_hospitals ON doctor_details.hospital_id = clinic_hospitals.id 
    JOIN users ON time_slots.doctor_id = users.id 
    JOIN prescriptions ON time_slots.doctor_id = prescriptions.doctor_id
    WHERE slot_bookings.slot_id = ?`;

    const [appointmentData] = await conn.query(sql3, [slot_id]);

    res.send({ appointmentData: appointmentData })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}