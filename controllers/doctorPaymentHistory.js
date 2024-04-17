const conn = require("../config/dbConnection");

exports.getPaymentHistorys = async (req, res) => {
  try {

    let doctor_id = req.user.id;

    if (!doctor_id) {
      return res.status(500).json({
        success: false,
        message: "doctor id not found"
      })
    }

    const sql = `SELECT  time_slots.doctor_id, time_slots.date AS slote_date, time_slots.start_time, time_slots.end_time, slot_bookings.slot_id, slot_bookings.patient_id, slot_bookings.booking_date AS payment_date, payments.payment_amount, users.fname, users.lname 
    FROM time_slots 
    JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id  
    JOIN payments ON time_slots.id = payments.slot_id
    JOIN users ON slot_bookings.patient_id = users.id
    WHERE time_slots.doctor_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0`;

    const [paymentDetails] = await conn.query(sql, [doctor_id]);

    res.render('pages/doctorPanel/viewpayment', { paymentDetails: paymentDetails })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}