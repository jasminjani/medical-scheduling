const conn = require("../../config/dbConnection");

exports.dashboardStatus = async (req, res) => {
  try {

    const sql = `SELECT count(*) AS total_doctor FROM users WHERE is_deleted = 0 AND role_id = 2 AND is_active = 1`;
    const [totalDoctor] = await conn.query(sql);

    const sql2 = `SELECT count(*) AS total_patient FROM users WHERE is_deleted = 0 AND role_id = 1 AND is_active = 1`;
    const [totalPatient] = await conn.query(sql2);

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let currentDate = year + "-" + month + "-" + day;
    console.log(currentDate);
    const sql3 = `SELECT count(*) AS today_appointment FROM slot_bookings JOIN time_slots ON slot_bookings.slot_id = time_slots.id WHERE slot_bookings.is_deleted = 0 AND slot_bookings.is_cancled = 0 AND time_slots.date = ?`;
    const [todayAppointment] = await conn.query(sql3, [currentDate]);

    const sql4 = `SELECT sum(payment_amount) AS total_revenue FROM payments WHERE is_refunded = 0`;
    const [totalRevenue] = await conn.query(sql4);

    res.send({ totalDoctor: totalDoctor, totalPatient: totalPatient, todayAppointment: todayAppointment, totalRevenue: totalRevenue });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}