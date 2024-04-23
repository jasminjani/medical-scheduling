const conn = require('../../config/dbConnection')



exports.dashBoardCount = async(req,res)=>{
  let doctor_id = req.user.id
  try {
    let [result] = await conn.query(`select sum(payment_amount) as revenue, count(patient_id) as patient, count(slot_id) as slot from payments where doctor_id = ? and is_refunded = 0;`,[doctor_id]);
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}

exports.dashBoardReviews = async(req,res)=>{
  let doctor_id = req.user.id
  try {
    let [result] = await conn.query(`select concat(fname," ",lname) as Name,email,rating,review,profile_picture from rating_and_reviews inner join users on rating_and_reviews.patient_id = users.id inner join profile_pictures on rating_and_reviews.patient_id = profile_pictures.user_id where doctor_id=? and profile_pictures.is_active = ?;`,[doctor_id,1])
    res.json(result)
  } catch (error) {
     return res.json({success: false,
    message: error.message
  })
}
}

exports.dashBoardAppointments = async(req,res)=>{
  let doctor_id = req.user.id
  try {
    let [result] = await conn.query(`select concat(fname," ",lname)as Name, concat(start_time," to ",end_time)as Appointment_time,slot_bookings.patient_id from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on slot_bookings.patient_id = users.id where doctor_id = ? and time_slots.date = curdate() and time_slots.is_booked = ?;`,[doctor_id,1])
    res.json(result)
  } catch (error) {
    return res.json({
      success:false,
      message:error.message
    })
  }
}