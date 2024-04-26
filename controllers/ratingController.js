const conn = require("../config/dbConnection");

exports.getRating = async (req, res) => {
  try {

    const { doctor_id } = req.params;

    console.log(doctor_id);

    const query = "select * from rating_and_reviews where doctor_id = ?";

    const [data] = await conn.query(query, [doctor_id]);

    return res.status(200).json({ success: true, message: data })

  }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}


exports.rating = async (req, res) => {
  try {

    const patient_id = req.user.id;
    const { doctor_id, rating, patientReview } = req.body;

    try {

      const query = "select * from rating_and_reviews where patient_id = ? and doctor_id = ?";

      const [isReviewExist] = await conn.query(query, [patient_id, doctor_id]);

      if (isReviewExist.length !== 0) return res.status(500).json({ success: false, message: "Review already added" })

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }

    try {

      const query = "select * from prescriptions where patient_id = ? and doctor_id = ?";

      const [isPatientExist] = await conn.query(query, [patient_id, doctor_id]);

      if (isPatientExist.length === 0) return res.status(500).json({ success: false, message: "You can not rate the doctor" })

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }

    try {

      const query = "insert into rating_and_reviews (`patient_id`,`doctor_id`,`rating`,`review`) values (?,?,?,?)";

      const [addReview] = await conn.query(query, [patient_id, doctor_id, rating, patientReview.trim()]);

      return res.status(500).json({ success: true, message: "Review added successfully" })

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }



  }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.updateRating = async (req, res) => {
  try {

    const { patient_id } = req.params;
    let query = `delete from rating_and_reviews where patient_id=?`;

    console.log("Data deleted!!");

    let [data] = await conn.query(query, [patient_id]);
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}