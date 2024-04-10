const conn = require("../config/dbConnection");


exports.rating = async (req, res) => {
  try {

    // console.log(req.params);
    console.log(req.body);

    // const { patient_id, doctor_id } = req.params;
    const { patient_id, doctor_id, rating, review } = req.body;

    let query = `insert into rating_and_reviews (patient_id, doctor_id, rating, review) values(?,?,?,?)`;
    console.log("Data added to DB");
    // console.log(query);

    let [data] = await conn.query(query, [patient_id, doctor_id, rating, review]);

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.updateRating = async (req, res) => {
  try {

    console.log(req.body);

    const { patient_id, doctor_id, rating, review } = req.body
    let query = `update rating_and_reviews set patient_id=?, doctor_id=?, rating=?, review=? where patient_id=?`;

    let [data] = await conn.query(query [patient_id, doctor_id, rating, review]);
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}