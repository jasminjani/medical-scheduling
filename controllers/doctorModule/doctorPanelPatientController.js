
const conn = require('../../config/dbConnection')

exports.getPatientData = async (req, res) => {
  const id = req.user.id
  try {
    const [result] = await conn.query(`select slot_bookings.patient_id, concat(fname," ",lname)as name,phone from slot_bookings left join time_slots on slot_bookings.slot_id = time_slots.id inner join patient_details on slot_bookings.patient_id = patient_details.patient_id inner join users on patient_details.patient_id = users.id where time_slots.doctor_id = ? group by patient_details.id;`, [id])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}

exports.patientHistoryData = async (req, res) => {
  try {
   
    const patient_id = req.params.patient_id
    const doctor_id = req.user.id
    const [result] = await conn.query(`select  date as "Appointment Date"  from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id where slot_bookings.patient_id = ? and time_slots.doctor_id = ? group by (date)`, [patient_id, doctor_id])

    res.json(result)
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    })
  }
}

exports.patientDetailsData = async (req, res) => {
  const patient_id = req.params.patient_id
  const doctor_id = req.user.id
  try {
    const [result] = await conn.query(`select concat(fname, " ", lname) as Name,profile_picture,gender as Gender, phone as Contact, email as Email,city as City, address as Address,blood_group as "Blood Group", dob as "Date of Birth" from slot_bookings inner join patient_details on slot_bookings.patient_id = patient_details.patient_id inner join users on patient_details.patient_id = users.id inner join time_slots on slot_bookings.slot_id = time_slots.id inner join profile_pictures on users.id = profile_pictures.user_id where slot_bookings.patient_id = ? and time_slots.doctor_id = ? limit 0,1;`,[patient_id,doctor_id])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}

exports.patientPrescriptionData = async (req, res) => {
  const patient_id = req.params.patient_id
  const doctor_id = req.user.id
  const date = req.params.date

  try {
    const [result] = await conn.query(`select time_slots.start_time,time_slots.end_time,prescriptions.prescription,prescriptions.diagnoses from prescriptions inner join slot_bookings on prescriptions.booking_id = slot_bookings.id inner join time_slots on slot_bookings.slot_id =time_slots.id where prescriptions.patient_id = ? and prescriptions.doctor_id = ? and time_slots.date = ? and time_slots.is_booked = 1;`, [patient_id, doctor_id, date])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}