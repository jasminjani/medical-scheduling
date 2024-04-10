const conn = require("../config/dbConnection");

exports.createSlots = async (req, res) => {
  try {

    const { day1, day2, day3, day4, day5, day6, day7 } = req.body;
    const { doctor_id } = req.params;

    try {
      const query = "select * from doctor_details where doctor_id = ?";

      const isDoctorExist = await conn.query(query, [doctor_id]);

      if (isDoctorExist[0].length === 0) return res.status(404).json({ success: false, message: "Doctor not exist" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {
      const dayArray = [day1, day2, day3, day4, day5, day6, day7]
      for (let i = 0; i < 7; i++) {
        for (let j = 1; j < dayArray[i].length; j++) {
          console.log(dayArray[i][j].split("-"));
        }
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}