const conn = require('../config/dbConnection')
const logger = require('../utils/pino')
let PDFDocument = require("pdfkit");

exports.patientDashboard = (req, res) => {
  res.render("pages/patientPanel/patientDashboard");
};

exports.patientStatus = async (req, res) => {
  let id = req.user.id;
  let date = new Date();
  // let fullDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  let fullDate = date.toISOString().slice(0, 10);
  // console.log(fullDate);

  let [doctorCount] = await conn.query(
    "select count(*) doctorCount from doctor_details where approved =1"
  );
  let [patientCount] = await conn.query(
    "select count(*) patientCount from users where role_id = 1"
  );
  let [patientTotalBooking] = await conn.query(
    "select count(*) patientTotalBooking from slot_bookings where patient_id = ?",
    [id]
  );
  let [TodaysBooking] = await conn.query(
    `select count(*) TodaysBooking from slot_bookings a
  join time_slots b on a.slot_id = b.id   where b.date = ? and a.patient_id = ?`,
    [fullDate, id]
  );

  res.json([
    doctorCount[0],
    patientCount[0],
    patientTotalBooking[0],
    TodaysBooking[0],
  ]);
};

exports.addPatientDetails = async (req, res) => {
  try {
    const { patientId, bloodgroup } = req.body;
    const medicalHistory = req.file.filename || "";

    if (!patientId) {
      return res.json({
        success: false,
        message: "Invalid User",
      });
    }

    let result;
    try {
      [result] = await conn.query(
        "insert into patient_details (patient_id,blood_group,medical_history) values (?)",
        [[patientId, bloodgroup, medicalHistory]]
      );
    } catch (error) {
      return res.json({
        success: false,
        message: "Internal Server Error",
      });
    }

    return res.json({
      success: true,
      message: "data inserted successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.patientDetails = async (req, res) => {
  try {
    const { id } = req.body;

    let [result] = await conn.query(
      "select * from patient_details where patient_id=?",
      [id]
    );

    if (result.length > 0) {
      return res.json({
        success: false,
        message: "patient present",
      });
    }

    return res.json({
      success: true,
      message: "patient details empty",
    });
  } catch (error) {}
};

exports.patientViewProfile = async (req, res) => {
  res.render("pages/patientPanel/patientProfileView");
};

exports.patientViewProfileData = async (req, res) => {
  try {
    const patient_id = req.user.id;
    let [result] = await conn.query(
      'select fname as "First name", lname as "Last name", email as Email,dob as "Date of Birth", gender as Gender, phone as Contact,  address as Address, city as City from users where users.id = ? and role_id = ?;',
      [patient_id, 1]
    );
    res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.getpatientProfileUpdate = async (req, res) => {
  res.render("pages/patientPanel/patientProfileUpdate");
};

exports.patientProfileUpdateData = async (req, res) => {
  try {
    const patient_id = req.user.id;
    let [result] = await conn.query(
      `select fname,lname,dob,gender,phone,address,city,profile_picture from users inner join profile_pictures on profile_pictures.user_id = users.id where role_id=? and users.id = ? and profile_pictures.is_active = ?`,
      [1, patient_id, 1]
    );
    res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.postPatientProfileUpdate = async (req, res) => {
  try {
    const patient_id = req.user.id;
    const { fname, lname, dob, phone, address, city, gender } = req.body;
    const profile_picture = req.file?.filename || "";

    if (!fname || !lname || !dob || !phone || !address || !city) {
      return res.status(402).json({
        success: false,
        message: "fill the fields",
      });
    }

    if (!patient_id) {
      return res.status(500).json({
        success: false,
        message: "Internal server Error",
      });
    }

    try {
      await conn.query(
        `update users set fname = ?,lname = ?, dob = ?, phone = ?, address = ?, city = ?, gender =? where users.id = ? and role_id = ?`,
        [fname, lname, dob, phone, address, city, gender, patient_id, 1]
      );
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }

    if (!profile_picture == "") {
      try {
        await conn.query(
          `update profile_pictures set is_active = ? where user_id = ?`,
          [0, patient_id]
        );
      } catch (error) {
        return res.json({
          success: false,
          message: error.message,
        });
      }

      try {
        await conn.query(
          `insert into profile_pictures (profile_picture,user_id) values (?,?)`,
          [profile_picture, patient_id]
        );
      } catch (error) {
        return res.json({
          success: false,
          message: error.message,
        });
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientAllAppointment = async (req, res) => {
  try {
    const { patient_id } = req.params;

    const sql = `SELECT users.id, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group FROM users JOIN patient_details ON users.id = patient_details.patient_id WHERE users.id = ? AND users.is_deleted = 0`;
    const [patientDetails] = await conn.query(sql, [patient_id]);
    // await console.log(patientDetails);

    // const sql2 = ``;

    res.render("pages/adminPanel/patientAllAppointment", {
      patientDetails: patientDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientProfile = async (req, res) => {
  try {
    res.render("pages/patientPanel/patientProfile");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientPastProfile = async (req, res) => {
  try {
    res.render("pages/patientPanel/patientPastBookings");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientUpcomingBookings = async (req, res) => {
  try {
    const { patient_id } = req.params;

    try {
      const query =
        "select time_slots.id,time_slots.doctor_id,slot_bookings.patient_id, slot_bookings.booking_date, time_slots.date,DAYNAME(time_slots.date) as day, time_slots.start_time,time_slots.end_time,users.fname, users.lname,users.email,users.phone,doctor_details.qualification, doctor_details.approved,doctor_details.consultancy_fees,clinic_hospitals.name, clinic_hospitals.location,clinic_hospitals.pincode,prescriptions.id as prescription_id from slot_bookings left join prescriptions on prescriptions.booking_id = slot_bookings.id inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on time_slots.doctor_id = users.id inner join doctor_details on time_slots.doctor_id = doctor_details.doctor_id inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id  where slot_bookings.patient_id = ? and slot_bookings.is_canceled = ? and slot_bookings.is_deleted = ? and time_slots.date >= CAST(NOW() as DATE) order by time_slots.date";

      let [data] = await conn.query(query, [patient_id, 0, 0]);

      data = data.filter((e) => {
        return !e.prescription_id;
      });

      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.patientPastBookings = async (req, res) => {
  try {
    const { patient_id } = req.params;

    try {
      const query =
        "select time_slots.id,time_slots.doctor_id,slot_bookings.patient_id, slot_bookings.booking_date, time_slots.date,DAYNAME(time_slots.date) as day, time_slots.start_time,time_slots.end_time,users.fname, users.lname,users.email,users.phone,doctor_details.qualification, doctor_details.approved,doctor_details.consultancy_fees,clinic_hospitals.name, clinic_hospitals.location,clinic_hospitals.pincode,prescriptions.id as prescription_id from slot_bookings left join prescriptions on prescriptions.booking_id = slot_bookings.id inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on time_slots.doctor_id = users.id inner join doctor_details on time_slots.doctor_id = doctor_details.doctor_id inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id  where slot_bookings.patient_id = ? and slot_bookings.is_canceled = ? and slot_bookings.is_deleted = ? and time_slots.date <= CAST(NOW() as DATE) order by time_slots.date desc";

      let [data] = await conn.query(query, [patient_id, 0, 0]);

      data = data.filter((e) => {
        return e.prescription_id;
      });

      return res.status(200).json({ success: true, message: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.patientPayments = async (req, res) => {
  try {
    // here patient_id is as id
    const { id } = req.user;
    // let id = 7;

    try {
      const query =
        'select time_slots.doctor_id,time_slots.date,time_slots.start_time,time_slots.end_time, concat(users.fname," ",users.lname) as doctor_name,users.phone,users.email,payments.payment_amount ,payments.is_refunded from payments inner join time_slots on time_slots.id = payments.slot_id inner join users on time_slots.doctor_id = users.id where patient_id = ?';

      const [data] = await conn.query(query, [id]);

      return res.status(200).json({ success: true, message: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchPatientPayment = async (req, res) => {
  try {
    const { paymentStatus, searchedData } = req.params;
    const { id } = req.user;
    // let id = 7;

    try {
      const query = `select time_slots.doctor_id,time_slots.date,time_slots.start_time,time_slots.end_time, concat(users.fname," ",users.lname) as doctor_name,users.phone,users.email,payments.payment_amount ,payments.is_refunded 
      from payments 
      inner join time_slots on time_slots.id = payments.slot_id 
      inner join users on time_slots.doctor_id = users.id 
      where patient_id = ? AND users.is_deleted = 0 AND (users.fname LIKE '${searchedData}%' OR users.lname LIKE '${searchedData}%' OR users.email LIKE '${searchedData}%' OR users.email LIKE '${searchedData}%' OR  time_slots.start_time LIKE '${searchedData}%' OR time_slots.end_time LIKE '${searchedData}%' OR  payments.payment_amount LIKE '${searchedData}%')`;

      const [data] = await conn.query(query, [id, paymentStatus]);

      return res.status(200).json({ success: true, message: data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.patientPanelPaymentHistory = async (req, res) => {
  await res.render("pages/patientPanel/paymentHistory");
};

exports.specialitiesCombo = async () => {
  let sql = "select * from specialities where approved = 1 order by speciality";
  let [result] = await conn.query(sql);

  let html = "";

  result.forEach((speciality) => {
    html += `<option value=${speciality.speciality} data-unique="${
      speciality.id
    }">${speciality.speciality.toUpperCase()}</option>`;
  });

  return html;
};

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
  });

  return res.json({ html: html });
};

exports.getDoctorSlotsById = async (req, res) => {
  return res.render("pages/patientPanel/appointment");
};

const generateSlotCombo = async (result) => {
  let html = `<option value="">--Select slot--</option>`;

  result.forEach((slot) => {
    html += `<option value=${slot.start_time + "-" + slot.id} data-sid="${
      slot.id
    }">${slot.start_time + " - " + slot.end_time}</option>`;
  });

  return html;
};

// Patients can see the slots of doctors
exports.getSingleSlots = async (req, res) => {
  try {
    const { doctor_id, date } = req.body;

    let result;
    try {
      const query = `select * from time_slots 
      where timestampdiff(second,current_timestamp(),concat(time_slots.date," ",time_slots.start_time))>0
      and doctor_id = ? and date = ? and is_booked = 0 and is_deleted = 0;`;

      [result] = await conn.query(query, [doctor_id, date]);

      console.log(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    let html = await generateSlotCombo(result);
    return res.status(200).json({ success: true, html: html });
    // return res.render('pages/patientPanel/appointment')
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Patients can book slots
exports.bookingSlot = async (req, res) => {
  try {
    const { paymentAmount, slotId, doctorId } = req.body;
    const patientId = req.user.id;
    try {
      const query =
        "select * from time_slots inner join slot_bookings on time_slots.id = slot_bookings.slot_id where time_slots.id = ? and (slot_bookings.is_canceled = ? or time_slots.is_booked=? or time_slots.is_deleted=?)";

      const [slotExist] = await conn.query(query, [slotId, 0, 1, 1]);

      // console.log(slotExist);

      if (slotExist.length !== 0)
        return res
          .status(404)
          .json({ success: false, message: "slot already booked" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {
      const query =
        "insert into slot_bookings (`slot_id`,`patient_id`,`booking_date`) values (?,?,NOW())";

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
      const query =
        "insert into payments(patient_id,doctor_id,slot_id,payment_amount,status) values(?,?,?,?,'1')";

      const [payment] = await conn.query(query, [
        patientId,
        doctorId,
        slotId,
        paymentAmount,
      ]);

      return res
        .status(200)
        .json({ success: true, message: "slot booked successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Patients can cancel slots
exports.cancelSlot = async (req, res) => {
  try {
    // const { patient_id, slot_id } = req.params;
    const { slot_id } = req.params;
    const patient_id = req.user.id;
    try {
      const query =
        "select * from slot_bookings where patient_id = ? and slot_id = ? and is_deleted = ?";

      const [checkBook] = await conn.query(query, [patient_id, slot_id, 0]);

      if (checkBook.length === 0)
        return res
          .status(500)
          .json({ success: false, message: "you can not cancel this slot" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    try {
      const query =
        "update slot_bookings set is_canceled = ? where slot_id = ? and patient_id = ?";

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
      return res.redirect("/patient/upcomingSlots");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.rating = async (req, res) => {
  try {
    // console.log(req.params);
    console.log(req.body);

    const { patient_id, doctor_id } = req.params;
    const { rating, review } = req.body;

    let query = `insert into rating_and_reviews (patient_id, doctor_id, rating, review) values(?,?,?,?)`;
    console.log("Data added to DB");
    // console.log(query);

    let [data] = await conn.query(query, [
      patient_id,
      doctor_id,
      rating,
      review,
    ]);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { patient_id } = req.params;
    let query = `delete from rating_and_reviews where patient_id=?`;

    console.log("Data deleted!!");

    let [data] = await conn.query(query, [patient_id]);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// MATCH DEFAULT CITY OF USER
exports.nearByDoctores = async (req, res) => {
  try {
    let patientId = req.user.id;

    if (!patientId) {
      return res.status(500).json({
        success: false,
        message: "cannot get patient id",
      });
    }

    const sql = `SELECT * FROM clinic_hospitals JOIN doctor_details ON doctor_details.hospital_id = clinic_hospitals.id JOIN users ON users.id =doctor_details.doctor_id WHERE users.is_deleted = 0 AND clinic_hospitals.city in (select city from users where id = ?)`;
    const [nearByDoctores] = await conn.query(sql, [patientId]);
    res.send(nearByDoctores);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// MATCH CITY BASED ON SEARCH
exports.nearByDoctoresOnSearch = async (req, res) => {
  try {
    let { city } = req.body;

    if (!city) {
      return res.status(500).json({
        success: false,
        message: "Enter valid city to search",
      });
    }

    const sql = `SELECT * FROM clinic_hospitals JOIN doctor_details ON doctor_details.hospital_id = clinic_hospitals.id JOIN users ON users.id =doctor_details.doctor_id WHERE users.is_deleted = 0 AND clinic_hospitals.city LIKE "${city}%"`;
    const [nearByDoctoresOnSearch] = await conn.query(sql);
    res.send(nearByDoctoresOnSearch);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
