const conn = require("../config/dbConnection");

exports.createSlotsPage = async (req, res) => {
  try {
    res.render("pages/slotPanel/addSlots");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Doctors can create slots
exports.createSlots = async (req, res) => {
  try {

    const { day1, day2, day3, day4, day5, day6, day7 } = req.body;

    const { doctor_id } = req.params;

    const dayArray = [day1, day2, day3, day4, day5, day6, day7]

    for (let i = 0; i < 7; i++) {

      if (dayArray[i].length > 1) {

        for (let j = 1; j < dayArray[i].length; j++) {
          if (dayArray[i][j]) {
            const slot = dayArray[i][j].split("-");
            const start_time = slot[0].trim();
            const end_time = slot[1].trim();

            // const s_t = await handleMiliseconds(start_time);
            // const e_t = await handleMiliseconds(end_time);

            // console.log(s_t + " " + e_t);

            try {

              const query = "select * from time_slots where doctor_id = ? and date = ? and end_time <= ?";

              const [isValid] = await conn.query(query, [doctor_id, dayArray[i][0], start_time]);

              // console.log(isValid);

            } catch (error) {
              return res.status(500).json({ success: false, message: error.message });
            }

            try {

              const query = 'insert into time_slots (`doctor_id`,`date`,`start_time`,`end_time`) values (?,?,?,?)';

              const [slots] = await conn.query(query, [doctor_id, dayArray[i][0], start_time, end_time]);


            } catch (error) {
              return res.status(500).json({ success: false, message: error.message });
            }
          }
        }
      }
    }
    return res.status(200).json({ success: true, message: "slots created successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

exports.specialitiesCombo = async () => {

  let sql = "select * from specialities where approved = 1 order by speciality";
  let [result] = await conn.query(sql);

  let html = "";

  result.forEach((speciality) => {
    html += `<option value=${speciality.speciality} data-unique="${speciality.id}">${speciality.speciality.toUpperCase()}</option>`;
  })

  return html;
}

// doctorCombo Data
exports.DoctorCobmo = async (req, res) => {
  let id = req.body.id;

  let sql = `select d.doctor_id as doctor_id, concat(u.fname," ", u.lname) as name, dd.consultancy_fees from doctor_has_specialities as d 
  inner join 
  users as u on d.doctor_id = u.id inner join doctor_details as dd on d.doctor_id= dd.doctor_id where speciality_id=?;`;
  let [result] = await conn.query(sql, [id]);

  let html = `<option value="">--Select Doctor--</option>`;

  result.forEach((doctor) => {
    html += `<option value=${doctor.name} data-consultancy_fees="${doctor.consultancy_fees}" data-did="${doctor.doctor_id}">${doctor.name}</option>`;
  })

  return res.json({ html: html });
}


exports.getBookingSlots = async (req, res) => {
  let html = await this.specialitiesCombo();
  return res.render('pages/patientPanel/appointment', { html })
}

const generateSlotCombo = async (result) => {
  let html = `<option value="">--Select slot--</option>`;

  result.forEach((slot) => {
    html += `<option value=${slot.start_time + "-" + slot.id} data-sid="${slot.id}">${slot.start_time + " - " + slot.end_time}</option>`;
  })

  return html;
}


// Patients can see the slots of doctors
exports.getSingleSlots = async (req, res) => {
  try {

    const { doctor_id, date } = req.body;

    let result;
    try {
      const query = "select * from time_slots where doctor_id = ? and date = ? and is_booked = 0 and is_deleted = 0";

      [result] = await conn.query(query, [doctor_id, date]);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    let html = await generateSlotCombo(result);
    return res.status(200).json({ success: true, html: html });
    // return res.render('pages/patientPanel/appointment')


  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Patients can book slots
exports.bookingSlot = async (req, res) => {
  try {

    const { paymentAmount, slotId, doctorId } = req.body;
    const patientId = req.user.id;
    try {

      const query = "select * from time_slots inner join slot_bookings on time_slots.id = slot_bookings.slot_id where time_slots.id = ? and (slot_bookings.is_canceled = ? or time_slots.is_booked=? or time_slots.is_deleted=?)";

      const [slotExist] = await conn.query(query, [slotId, 0, 1, 1]);

      // console.log(slotExist);

      if (slotExist.length !== 0) return res.status(404).json({ success: false, message: "slot already booked" });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = 'insert into slot_bookings (`slot_id`,`patient_id`,`booking_date`) values (?,?,NOW())';

      const [book] = await conn.query(query, [slotId, patientId]);

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "update time_slots set is_booked = 1 where id = ?";

      const [book] = await conn.query(query, [slotId]);

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "insert into payments(patient_id,doctor_id,slot_id,payment_amount,status) values(?,?,?,?,'1')";

      const [payment] = await conn.query(query, [patientId, doctorId, slotId, paymentAmount]);

      return res.status(200).json({ success: true, message: "slot booked successfully" });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Slot Page Render
exports.getSlotsPage = async (req, res) => {
  try {
    res.render("pages/slotPanel/upcomingSlots");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Get All Dates
exports.getDates = async (req, res) => {
  try {

    const { doctor_id } = req.params;

    try {

      const query = 'SELECT DISTINCT date as dates,DAYNAME(date) as day from time_slots where doctor_id = ? and is_deleted = ? and date >= CAST(NOW() as DATE) order by dates limit 7';

      const [data] = await conn.query(query, [doctor_id, 0]);

      return res.status(200).json({ success: true, message: data });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Doctors can get all upcoming slots
exports.getAllSlots = async (req, res) => {
  try {

    const { doctor_id, date } = req.params;

    try {

      // const query = 'SELECT time_slots.id,time_slots.date,time_slots.start_time,time_slots.end_time,users.fname as patient_name,users.phone FROM time_slots left join slot_bookings on time_slots.id = slot_bookings.slot_id left join users on slot_bookings.patient_id = users.id where time_slots.doctor_id = ? and time_slots.date >= CAST(NOW() as DATE) and time_slots.is_deleted = ? and date = ? and slot_bookings.is_canceled != ? order by time_slots.date';

      const query = 'select time_slots.id, time_slots.start_time,time_slots.end_time, concat(users.fname," ",users.lname) as patient_name,users.phone from time_slots  left join slot_bookings on time_slots.id =  slot_bookings.slot_id left join users on slot_bookings.patient_id = users.id where time_slots.date = ? and time_slots.is_deleted = ? and time_slots.doctor_id = ?';

      const [data] = await conn.query(query, [date, 0, doctor_id]);

      return res.status(200).json({ success: true, message: data });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Doctors can delete slots
exports.deleteSlot = async (req, res) => {
  try {

    const { doctor_id, slot_id } = req.params;

    try {

      const query = "select * from time_slots where doctor_id = ? and id = ? and is_deleted = ?";

      const [checkSlot] = await conn.query(query, [doctor_id, slot_id, 0]);

      if (checkSlot.length === 0) return res.status(500).json({ success: false, message: "you can not cancel this slot" });


    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "update time_slots set is_deleted = ?,deleted_at = NOW() where id = ?";

      const [deleted] = await conn.query(query, [1, slot_id]);

    } catch (error) {
      console.log(error);

      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "update slot_bookings set is_deleted = ?,deleted_at = NOW() where slot_id = ?";

      const [deleted] = await conn.query(query, [1, slot_id]);

    } catch (error) {
      console.log(error);

      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "update payments set is_refunded = ? where slot_id = ?";

      const [refunded] = await conn.query(query, [1, slot_id]);

      // return res.status(200).json({ success: true, message: "slot deleted successfully" });
      res.redirect("/upcomingSlots");

    } catch (error) {
      console.log(error);

      return res.status(500).json({ success: false, message: error.message });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Patients can cancel slots
exports.cancelSlot = async (req, res) => {

  try {

    const { patient_id, slot_id } = req.params;

    try {

      const query = "select * from slot_bookings where patient_id = ? and slot_id = ? and is_deleted = ?";

      const [checkBook] = await conn.query(query, [patient_id, slot_id, 0]);

      if (checkBook.length === 0) return res.status(500).json({ success: false, message: "you can not cancel this slot" });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "update slot_bookings set is_canceled = ? where slot_id = ? and patient_id = ?";

      const [canceled] = await conn.query(query, [1, slot_id, patient_id]);

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "update time_slots set is_booked = ? where id = ?";

      const [canceled] = await conn.query(query, [0, slot_id]);

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {

      const query = "update payments set is_refunded = ? where slot_id = ?";

      const [refunded] = await conn.query(query, [1, slot_id]);

      // return res.status(200).json({ success: true, message: "slot canceled successfully" });
      return res.redirect("/patientUpcomingSlots");

    } catch (error) {
      console.log(error);
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