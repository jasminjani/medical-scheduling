const conn = require("../config/dbConnection");

// Doctors can create slots
exports.createSlots = async (req, res) => {
  try {
    const { day1, day2, day3, day4, day5, day6, day7 } = req.body;
    const { doctor_id } = req.params;

    const dayArray = [day1, day2, day3, day4, day5, day6, day7]
    for (let i = 0; i < 7; i++) {

      try {

        const query = "select * from time_slots where date = ?";

        const [slotExist] = await conn.query(query, [dayArray[i][0]]);

        if (slotExist.length > 0) return res.status(404).json({ success: false, message: "slot already generated" });

      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      if (dayArray[i].length > 1) {
        for (let j = 1; j < dayArray[i].length; j++) {
          const slot = dayArray[i][j].split("-");
          const start_time = slot[0].trim();
          const end_time = slot[1].trim();

          // const s_t = await handleMiliseconds(start_time);
          // const e_t = await handleMiliseconds(end_time);

          // console.log(s_t + " " + e_t);

          try {

            const query = "select * from time_slots where doctor_id = ? and date = ? and end_time <= ?";

            const [isValid] = await conn.query(query, [doctor_id, dayArray[i][0], start_time]);

            console.log(isValid);

          } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
          }

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

// Patients can see the slots of doctors
exports.getSingleSlots = async (req, res) => {
  try {

    const { doctor_id, date } = req.params;

    try {

      const query = "select * from time_slots where doctor_id = ? and date = ?";

      const [slots] = await conn.query(query, [doctor_id, date]);

      return res.status(200).json({ success: true, message: slots });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Patients can book slots
exports.bookingSlot = async (req, res) => {
  try {

    const { patient_id, slot_id } = req.params;

    const { payment_amount } = req.body;

    try {

      const query = "select * from time_slots where id = ?";

      const [slotExist] = await conn.query(query, [slot_id]);

      if (slotExist[0].is_booked) return res.status(404).json({ success: false, message: "slot already booked" });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = 'insert into slot_bookings (`slot_id`,`patient_id`,`booking_date`) values (?,?,NOW())';

      const [book] = await conn.query(query, [slot_id, patient_id]);

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "update time_slots set is_booked = 1 where id = ?";

      const [book] = await conn.query(query, [slot_id]);

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "insert into payments(patient_id,slot_id,payment_amount,status) values(?,?,?,'1')";

      const [payment] = await conn.query(query, [patient_id, slot_id, payment_amount]);

      return res.status(200).json({ success: true, message: "slot booked successfully" });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

exports.getAllSlots = async (req, res) => {
  try {

    const { doctor_id } = req.params;

    try {

      const query = 'select * from time_slots where doctor_id = ? and date >= NOW()';

      const [data] = await conn.query(query, [doctor_id]);

      console.log(data);

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// const handleMiliseconds = async (time) => {
//   try {
//     time = time.split(":");
//     const hours = parseInt(time[0], 10);
//     const minutes = parseInt(time[1], 10);
//     const miliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
//     return miliseconds;
//   } catch (error) {
//     console.log(error);
//   }
// }