const conn = require("../../config/dbConnection");

exports.patientDashboard = (req, res) => {

  res.render('pages/patientPanel/patientDashboard');
}

exports.patientStatus = async (req, res) => {

  let id = req.params.id;
  let date = new Date();
  // let fullDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  let fullDate = date.toISOString().slice(0, 10);
  console.log(fullDate);

  let [doctorCount] = await conn.query('select count(*) doctorCount from doctor_details where approved =1');
  let [patientCount] = await conn.query('select count(*) patientCount from users where role_id = 1')
  let [patientTotalBooking] = await conn.query('select count(*) patientTotalBooking from slot_bookings where patient_id = ?', [id])
  let [TodaysBooking] = await conn.query(`select count(*) TodaysBooking from slot_bookings a
  join time_slots b on a.slot_id = b.id   where b.date = ? and a.patient_id = ?`, [fullDate, id])

  res.json([
    doctorCount[0],
    patientCount[0],
    patientTotalBooking[0],
    TodaysBooking[0]
  ]);
}