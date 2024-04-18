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

exports.patientBookings = async (req, res) => {
  try {

    const { patient_id } = req.params;

    try {
      const query = "select slot_bookings.booking_date,time_slots.date,time_slots.start_time,time_slots.end_time,users.fname,users.lname,users.email,users.phone,doctor_details.qualification,doctor_details.approved,doctor_details.consultancy_fees,clinic_hospitals.name,clinic_hospitals.location,clinic_hospitals.pincode from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on time_slots.doctor_id = users.id inner join doctor_details on time_slots.doctor_id = doctor_details.doctor_id inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id where slot_bookings.patient_id=? and slot_bookings.is_canceled = ?";

      const [data] = await conn.query(query, [patient_id, 0]);

      return res.status(200).json({ success: true, message: data });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.patientPayments = async(req,res)=>{
  try {
    const { patient_id } = req.params;

    try {
      const query = "select slot_bookings.booking_date,time_slots.date,time_slots.start_time,time_slots.end_time,users.fname,users.lname,users.phone,users.email,doctor_details.qualification,clinic_hospitals.name,clinic_hospitals.location,clinic_hospitals.pincode,payments.status,payments.payment_amount,payments.is_refunded from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on time_slots.doctor_id = users.id inner join doctor_details on time_slots.doctor_id = doctor_details.doctor_id inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id inner join payments on payments.patient_id = slot_bookings.patient_id where slot_bookings.patient_id = ?";

      const [data] = await conn.query(query, [patient_id]);

      return res.status(200).json({ success: true, message: data });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}