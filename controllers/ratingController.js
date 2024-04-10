const conn = require("../config/dbConnection");


exports.rating = async (req, res) => {
  try {

    // console.log(req.params);
    console.log(req.body);

    const { patient_id, doctor_id } = req.params;
    const { rating, review } = req.body;

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

    const { patient_id} = req.params;
    let query = `delete from rating_and_reviews where patient_id=?`;

    console.log("Data deleted!!");

    let [data] = await conn.query(query [patient_id]);
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}