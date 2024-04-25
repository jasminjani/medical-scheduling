const conn = require('../../config/dbConnection')

exports.searchReview = async (req,res)=>{
  let doctor_id = req.user.id
  let search = req.params.search
  try {
    let [result] = await conn.query(` select concat(fname," ",lname) as name, rating_and_reviews.rating, rating_and_reviews.review ,convert(rating_and_reviews.created_at,date) as date from rating_and_reviews inner join users on rating_and_reviews.patient_id = users.id where (fname like "${search}%" or lname like "${search}%") and rating_and_reviews.doctor_id = ?; `,[doctor_id]) 
    res.status(200).json(result)
    
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}


exports.getPatientSearchData = async (req, res) => {
  const doctor_id = req.user.id
  let search = req.params.search
  try {
    const [result] = await conn.query(`select slot_bookings.patient_id, concat(fname," ",lname)as name,phone from slot_bookings left join time_slots on slot_bookings.slot_id = time_slots.id inner join patient_details on slot_bookings.patient_id = patient_details.patient_id inner join users on patient_details.patient_id = users.id where (fname like "${search}%" or lname like "${search}%") and time_slots.doctor_id = ? group by patient_details.id;`, [doctor_id])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}
