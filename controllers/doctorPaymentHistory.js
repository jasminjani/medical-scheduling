const conn = require("../config/dbConnection");

exports.paymentHistory = async (req, res) => {
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