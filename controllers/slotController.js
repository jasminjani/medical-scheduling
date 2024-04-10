const conn = require("../config/dbConnection");

// Doctors can create slots
exports.createSlots = async (req, res) => {
  try {
    const { day1, day2, day3, day4, day5, day6, day7 } = req.body;
    const { doctor_id } = req.params;
    try {
      const query = "select * from doctor_details where doctor_id = ?";

      const [isDoctorExist] = await conn.query(query, [doctor_id]);

      if (isDoctorExist[0].length === 0) return res.status(404).json({ success: false, message: "doctor not exist" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const dayArray = [day1, day2, day3, day4, day5, day6, day7]
    for (let i = 0; i < 7; i++) {
      if (dayArray[i].length > 1) {
        for (let j = 1; j < dayArray[i].length; j++) {
          const slot = dayArray[i][j].split("-");
          const start_time = slot[0].trim();
          const end_time = slot[1].trim();

          try {
            const query = 'insert into time_slots (`doctor_id`,`date`,`start_time`,`end_time`) values (?,?,?,?)';
            const [slots] = await conn.query(query, [doctor_id, dayArray[i][0], start_time, end_time]);
            return res.status(200).json({ success: true, message: "slots created successfully" });
          } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
          }

        }
      }
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

//Patients can see the slots of doctors
exports.getSlots = async (req, res) => {
  try {

    const { doctor_id, date } = req.params;

    try {

      const query = "select * from doctor_details where doctor_id = ?";

      const [isDoctorExist] = await conn.query(query, [doctor_id]);

      if (isDoctorExist[0].length === 0) return res.status(404).json({ success: false, message: "doctor not exist" });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "select * from time_slots where doctor_id=? and date = ?";

      const [slots] = await conn.query(query, [doctor_id, date]);

      return res.status(200).json({ success: true, message: slots });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
