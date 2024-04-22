const conn = require('../../config/dbConnection')

exports.doctorReviewData = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    let [data] = await conn.query(`select concat(fname," ",lname) as name, rating_and_reviews.rating, rating_and_reviews.review ,convert(rating_and_reviews.created_at,date) as date from rating_and_reviews inner join users on rating_and_reviews.patient_id = users.id where rating_and_reviews.doctor_id = ?`, [doctor_id]);
    res.json(data)
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};