const conn = require("../config/dbConnection");

exports.getPatientPayment = async (req, res) => {
  try {

    let doctor_id = req.user.id;
    // let doctor_id = 2;
    let { patient_id } = req.params;

    if (!doctor_id || !patient_id) {
      return res.status(500).json({
        success: false,
        message: "doctor id or patient id not found"
      })
    }

    const sql = `SELECT  time_slots.doctor_id, time_slots.date AS slote_date, time_slots.start_time, time_slots.end_time, slot_bookings.slot_id, slot_bookings.patient_id, slot_bookings.booking_date AS payment_date, payments.payment_amount, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group
    FROM time_slots 
    JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id  
    JOIN payments ON time_slots.id = payments.slot_id
    JOIN users ON slot_bookings.patient_id = users.id
    JOIN patient_details ON slot_bookings.patient_id = patient_details.patient_id
    WHERE time_slots.doctor_id = ? AND slot_bookings.patient_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0`;

    const [paymentDetails] = await conn.query(sql, [doctor_id, patient_id]);

    res.send({ paymentDetails: paymentDetails })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// This controller is for searching in particular patient payment history table but not in use
exports.searchPaymentHistory = async (req, res) => {
  try {

    let doctor_id = req.user.id;
    // let doctor_id = 2;
    let { search } = req.params;
    let { patient_id } = req.params;

    if (!doctor_id || !patient_id) {
      return res.status(500).json({
        success: false,
        message: "doctor id or patient id not found"
      })
    }

    const sql = `SELECT  time_slots.doctor_id, time_slots.date AS slote_date, time_slots.start_time, time_slots.end_time, slot_bookings.slot_id, slot_bookings.patient_id, slot_bookings.booking_date AS payment_date, payments.payment_amount, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group
    FROM time_slots 
    JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id  
    JOIN payments ON time_slots.id = payments.slot_id
    JOIN users ON slot_bookings.patient_id = users.id
    JOIN patient_details ON slot_bookings.patient_id = patient_details.patient_id
    WHERE time_slots.doctor_id = ? AND slot_bookings.patient_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0
    AND (time_slots.date LIKE '${search}%' OR time_slots.start_time LIKE '${search}%' OR time_slots.end_time LIKE '${search}%' OR slot_bookings.booking_date LIKE '${search}%' OR payments.payment_amount LIKE '${search}%' OR users.fname LIKE '${search}%' OR users.lname LIKE '${search}%' OR users.email LIKE '${search}%' OR users.gender LIKE '${search}%' OR users.phone LIKE '${search}%' OR users.city LIKE '${search}%' OR users.dob LIKE '${search}%' OR users.address LIKE '${search}%' OR patient_details.blood_group LIKE '${search}%')`;

    const [paymentDetails] = await conn.query(sql, [doctor_id]);

    res.send({ paymentDetails: paymentDetails })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
