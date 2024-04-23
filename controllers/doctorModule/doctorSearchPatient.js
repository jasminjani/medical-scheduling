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

