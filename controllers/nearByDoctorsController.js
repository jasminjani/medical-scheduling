const conn = require("../config/dbConnection");

// MATCH DEFAULT CITY OF USER
exports.nearByDoctores = async (req, res) => {
  try {

    let patientId = req.user.id;

    if (!patientId) {
      return res.status(500).json({
        success: false,
        message: "cannot get patient id"
      })
    }

    const sql = `SELECT * FROM clinic_hospitals JOIN doctor_details ON doctor_details.hospital_id = clinic_hospitals.id JOIN users ON users.id =doctor_details.doctor_id WHERE clinic_hospitals.city in (select city from users where id = ?)`;
    const [nearByDoctores] = await conn.query(sql, [patientId]);
    res.send(nearByDoctores)

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// MATCH CITY BASED ON SEARCH
exports.nearByDoctoresOnSearch = async (req, res) => {
  try {

    let { city } = req.body;

    if (!city) {
      return res.status(500).json({
        success: false,
        message: "Enter valid city to search"
      })
    }

    const sql = `SELECT * FROM clinic_hospitals JOIN doctor_details ON doctor_details.hospital_id = clinic_hospitals.id JOIN users ON users.id =doctor_details.doctor_id WHERE clinic_hospitals.city LIKE "${city}%"`;
    const [nearByDoctoresOnSearch] = await conn.query(sql);
    res.send(nearByDoctoresOnSearch)

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};