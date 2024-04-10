const conn = require("../config/dbConnection");


exports.rating = async (req, res) => {
  try {

    console.log(req.params);
    console.log(req.body);

    const { patient_id, doctor_id } = req.params;
    const { rating, review } = req.body;

    let query = `insert into rating_and_reviews (patient_id, doctor_id, rating, review) values(?,?,?,?)`;
    // console.log(query);

    let [data] = await conn.query(query, [patient_id, doctor_id, rating, review])


  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}