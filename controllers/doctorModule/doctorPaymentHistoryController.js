const conn = require('../../config/dbConnection')

exports.doctorPanelPaymentHistory = async (req, res) => {
  await res.render('pages/doctorPanel/viewpayment')
}

exports.showpaymentHistory = async (req, res) => {
  try {

    let doctor_id = req.user.id;
    // let doctor_id = 2;

    if (!doctor_id) {
      return res.status(500).json({
        success: false,
        message: "doctor id not found"
      })
    }

    const sql = `SELECT time_slots.doctor_id, users.id AS patient_id, users.fname, users.lname, users.phone
    FROM time_slots 
    JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id  
    JOIN users ON slot_bookings.patient_id = users.id
    WHERE time_slots.doctor_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0 GROUP BY users.id`;

    const [patientHistory] = await conn.query(sql, [doctor_id]);

    res.send({ patientHistory: patientHistory })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.searchPaymentHistory = async (req, res) => {
  try {

    let doctor_id = req.user.id;
    // let doctor_id = 2;
    let { search } = req.params;

    if (!doctor_id) {
      return res.status(500).json({
        success: false,
        message: "doctor id not found"
      })
    }

    const sql = `SELECT time_slots.doctor_id, users.id AS patient_id, users.fname, users.lname, users.phone
    FROM time_slots 
    JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id  
    JOIN users ON slot_bookings.patient_id = users.id
    WHERE time_slots.doctor_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0 
    AND (users.fname LIKE '${search}%' OR users.lname LIKE '${search}%' OR users.phone LIKE '${search}%')
    GROUP BY users.id`;

    const [patientHistory] = await conn.query(sql, [doctor_id]);

    res.send({ patientHistory: patientHistory })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



exports.patientPaymentHistory = async (req, res) => {
  await res.render('pages/doctorPanel/patientPaymentHistory');
};

exports.showPatientPayment = async (req, res) => {
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

    const sql = `SELECT  profile_pictures.profile_picture,time_slots.doctor_id, time_slots.date AS slote_date, time_slots.start_time, time_slots.end_time, slot_bookings.slot_id, slot_bookings.patient_id, slot_bookings.booking_date AS payment_date, payments.payment_amount, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group
    FROM time_slots 
    LEFT JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id  
    LEFT JOIN payments ON time_slots.id = payments.slot_id
    LEFT JOIN users ON slot_bookings.patient_id = users.id
    LEFT JOIN profile_pictures ON profile_pictures.user_id = users.id
    LEFT JOIN patient_details ON slot_bookings.patient_id = patient_details.patient_id
    WHERE time_slots.doctor_id = ? AND slot_bookings.patient_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0 AND profile_pictures.is_active = 1`;

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
exports.searchPatientPayment = async (req, res) => {
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

    const sql = `SELECT profile_pictures.profile_picture, time_slots.doctor_id, time_slots.date AS slote_date, time_slots.start_time, time_slots.end_time, slot_bookings.slot_id, slot_bookings.patient_id, slot_bookings.booking_date AS payment_date, payments.payment_amount, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group
    FROM time_slots 
    LEFT JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id  
    LEFT JOIN payments ON time_slots.id = payments.slot_id
    LEFT JOIN users ON slot_bookings.patient_id = users.id
    LEFT JOIN profile_pictures ON profile_pictures.user_id = users.id
    LEFT JOIN patient_details ON slot_bookings.patient_id = patient_details.patient_id
    WHERE time_slots.doctor_id = ? AND slot_bookings.patient_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0
    AND (time_slots.date LIKE '${search}%' OR time_slots.start_time LIKE '${search}%' OR time_slots.end_time LIKE '${search}%' OR slot_bookings.booking_date LIKE '${search}%' OR payments.payment_amount LIKE '${search}%')`;

    const [paymentDetails] = await conn.query(sql, [doctor_id]);

    res.send({ paymentDetails: paymentDetails })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
