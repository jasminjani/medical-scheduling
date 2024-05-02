const conn = require('../config/dbConnection')
const logger = require('../utils/pino')


exports.patientDashboard = async (req, res) => {
  try {
    let html = await this.specialitiesCombo();
    res.render('pages/patientPanel/patientDashboard', { html });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientStatus = async (req, res) => {

  try {
    let id = req.user.id;
    let date = new Date();
    // let fullDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    let fullDate = date.toISOString().slice(0, 10);


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

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      message: "data inserted successfully",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
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
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientViewProfile = async (req, res) => {
  try {
    res.render("pages/patientPanel/patientProfileView");

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getpatientProfileUpdate = async (req, res) => {
  try {
    res.render("pages/patientPanel/patientProfileUpdate");

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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
    logger.error(error.message);
    res.status(500).json({
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
      logger.error(error.message);
      return res.status(500).json({
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
        logger.error(error.message);
        return res.status(500).json({
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
        logger.error(error.message);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    let result;
    try {
      [result] = await conn.query(` select u.id,u.fname,u.lname,u.email,u.gender,u.dob,u.phone,u.city,u.address,u.role_id,pp.profile_picture as profile from users as u left join profile_pictures as pp on u.id = pp.user_id where pp.is_active =1 and u.id = ?;`, [patient_id])
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }

    result[0].token = req.cookies.token;

    return res
      .status(200)
      .json({ success: true, message: "Updated successfully", data: result });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
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


    res.render("pages/adminPanel/patientAllAppointment", {
      patientDetails: patientDetails,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientProfile = async (req, res) => {
  try {
    res.render("pages/patientPanel/patientProfile");
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientPastProfile = async (req, res) => {
  try {
    res.render("pages/patientPanel/patientPastBookings");
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
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
        `select time_slots.id,time_slots.doctor_id,slot_bookings.patient_id, slot_bookings.booking_date, time_slots.date,DAYNAME(time_slots.date) as day, time_slots.start_time,time_slots.end_time,users.fname, users.lname,users.email,users.phone,doctor_details.qualification, doctor_details.approved,doctor_details.consultancy_fees,clinic_hospitals.name, clinic_hospitals.location,clinic_hospitals.pincode,prescriptions.id as prescription_id from slot_bookings left join prescriptions on prescriptions.booking_id = slot_bookings.id inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on time_slots.doctor_id = users.id inner join doctor_details on time_slots.doctor_id = doctor_details.doctor_id inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id  where slot_bookings.patient_id = ? and slot_bookings.is_canceled = ?  and timestampdiff(minute,utc_timestamp(),time_slots.start_time)>0 and slot_bookings.is_deleted = ? and time_slots.date >= CAST(NOW() as DATE) order by time_slots.date`;

      let [data] = await conn.query(query, [patient_id, 0, 0]);


      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientPastBookings = async (req, res) => {
  try {
    const { patient_id } = req.params;
    try {
      const query =
        `select time_slots.id,time_slots.doctor_id,slot_bookings.patient_id, 
        slot_bookings.booking_date, time_slots.date,DAYNAME(time_slots.date) as day,
        time_slots.start_time,time_slots.end_time,users.fname, 
        users.lname,users.email,users.phone,doctor_details.qualification, 
        doctor_details.approved,doctor_details.consultancy_fees,
        clinic_hospitals.name, clinic_hospitals.location,clinic_hospitals.pincode,
        prescriptions.id as prescription_id from slot_bookings 
        left join prescriptions on prescriptions.booking_id = slot_bookings.id 
        inner join time_slots on slot_bookings.slot_id = time_slots.id 
        inner join users on time_slots.doctor_id = users.id 
        inner join doctor_details on time_slots.doctor_id = doctor_details.doctor_id 
        inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id  
        where slot_bookings.patient_id = ? and slot_bookings.is_canceled = 0 
        and timestampdiff(minute,utc_timestamp(),time_slots.start_time) < 0
        and slot_bookings.is_deleted = 0 and time_slots.date <= CAST(NOW() as DATE) 
        order by time_slots.date desc;`

      let [data] = await conn.query(query, [patient_id, 0, 0]);


      return res.status(200).json({ success: true, message: data });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.searchPatientPaymentHistory = async (req, res) => {
  try {
    const { paymentStatus, searchedData } = req.params;
    const { id } = req.user;
    // let id = 7;

    try {
      const query = `select time_slots.doctor_id,time_slots.date,time_slots.start_time,time_slots.end_time, concat(users.fname," ",users.lname) as doctor_name,users.phone,users.email,payments.payment_amount ,payments.is_refunded 
      from payments 
      inner join time_slots on time_slots.id = payments.slot_id 
      inner join users on time_slots.doctor_id = users.id 
      where patient_id = ? AND users.is_deleted = 0 AND (users.fname LIKE '${searchedData}%' OR users.lname LIKE '${searchedData}%' OR users.email LIKE '${searchedData}%' OR time_slots.date LIKE '%${searchedData}%' OR  time_slots.start_time LIKE '${searchedData}%' OR time_slots.end_time LIKE '${searchedData}%' OR  payments.payment_amount LIKE '${searchedData}%')`;

      const [data] = await conn.query(query, [id, paymentStatus]);

      return res.status(200).json({ success: true, message: data });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientPanelPaymentHistory = async (req, res) => {
  try {
    await res.render("pages/patientPanel/paymentHistory");

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.specialitiesCombo = async () => {

  try {

    let sql = "select * from specialities where approved = 1 order by speciality";
    let [result] = await conn.query(sql);

    let html = "";

    result.forEach((speciality) => {
      html += `<option value=${speciality.speciality} data-unique="${speciality.id
        }">${speciality.speciality.toUpperCase()}</option>`;
    });
    return html;

  } catch (error) {
    logger.error(error.message);
  }
};

// doctorCombo Data
exports.DoctorCobmo = async (req, res) => {

  try {
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

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Patients can see the slots of doctors
exports.getSingleSlots = async (req, res) => {
  try {
    const { doctor_id, date } = req.body;

    let result;
    try {
      const query = `select * from time_slots 
      where timestampdiff(second,utc_timestamp(),time_slots.start_time)>0
      and doctor_id = ? and date = ? and is_booked = 0 and is_deleted = 0;`;

      [result] = await conn.query(query, [doctor_id, date]);


    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // let html = await generateSlotCombo(result);
    return res.status(200).json({ success: true, result: result });
    // return res.render('pages/patientPanel/appointment')
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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



      if (slotExist.length !== 0)
        return res
          .status(404)
          .json({ success: false, message: "slot already booked" });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
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

      try {
        await conn.query(`insert into notifications (user_id,message,type,start_at,end_at)
        values 
        (?,concat("Your appointment booked with"," ", (select concat(fname," ", lname) from users where id = ?)),"upcoming",
        (select timestampadd(hour,-2,start_time)as start_at from time_slots where id=?),
        (select start_time from time_slots where id = ?));`, [patientId, doctorId, slotId, slotId, slotId])
      } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      return res
        .status(200)
        .json({ success: true, message: "slot booked successfully" });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    try {
      const query =
        "update slot_bookings set is_canceled = ? where slot_id = ? and patient_id = ?";

      const [canceled] = await conn.query(query, [1, slot_id, patient_id]);
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    try {
      const query = "update time_slots set is_booked = ? where id = ?";

      const [canceled] = await conn.query(query, [0, slot_id]);
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    try {
      const query = "update payments set is_refunded = ? where slot_id = ?";

      const [refunded] = await conn.query(query, [1, slot_id]);

      // return res.status(200).json({ success: true, message: "slot canceled successfully" });
      return res.redirect("/patient/upcomingSlots");
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    const sql = `SELECT u.id, u.fname, u.lname, dd.qualification, dd.consultancy_fees, ch.name AS hospital_name, ch.city,
    ch.location,pp.profile_picture,s.speciality,COUNT(rr.id) AS total_reviews,AVG(rr.rating) AS rating
    FROM users AS u
    INNER JOIN doctor_details AS dd ON u.id = dd.doctor_id AND dd.approved = 1
    INNER JOIN profile_pictures AS pp ON u.id = pp.user_id AND pp.is_active = 1
    INNER JOIN doctor_has_specialities AS ds ON u.id = ds.doctor_id
    INNER JOIN specialities AS s ON ds.speciality_id = s.id
    INNER JOIN clinic_hospitals AS ch ON dd.hospital_id = ch.id
    LEFT JOIN rating_and_reviews AS rr ON u.id = rr.doctor_id
    WHERE u.is_deleted = 0 AND ch.city in (select city from users where id = ?)
    GROUP BY u.id,pp.created_at,pp.profile_picture,s.speciality,dd.qualification,dd.consultancy_fees,ch.name, ch.city,ch.location 
    ORDER BY rating DESC`;

    let [result] = await conn.query(sql, [patientId]);

    let data = Object.values(result.reduce((acc, { id, fname, lname, qualification, consultancy_fees, hospital_name, city, location, profile_picture, speciality, total_reviews, rating }) => {
      acc[id] ??= { id, fname, lname, qualification, consultancy_fees, hospital_name, city, location, profile_picture, total_reviews, rating, specialities: [] };
      acc[id].specialities.push(speciality)
      return acc;
    }, {}));
    res.send({ data })

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// MATCH CITY BASED ON SEARCH NOT IN USE
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
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rating = async (req, res) => {
  try {

    const patient_id = req.user.id;
    const { doctor_id, rating, patientReview } = req.body;

    try {

      const query = "select * from rating_and_reviews where patient_id = ? and doctor_id = ?";

      const [isReviewExist] = await conn.query(query, [patient_id, doctor_id]);

      if (isReviewExist.length !== 0) return res.status(500).json({ success: false, message: "Review already added" })

    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
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
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }



  }
  catch (error) {
    logger.error(error.message);
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.updateRating = async (req, res) => {
  try {

    const { doctor_id } = req.params;

    const { rating, review } = req.query;

    const patient_id = req.user.id;

    let query = `update rating_and_reviews set rating = ?,review = ? where doctor_id = ? and patient_id = ?`;

    let [data] = await conn.query(query, [rating, review, doctor_id, patient_id]);

    return res.json({
      success:true,
      message:"Review Updated Successfully"
    })

  }
  catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getDoctorRating = async (req, res) => {
  try {

    const { doctor_id } = req.params;

    const id = req.user.id;

    const query = "select * from rating_and_reviews inner join users on users.id = rating_and_reviews.patient_id where rating_and_reviews.doctor_id = ?";

    let [data] = await conn.query(query, [doctor_id]);

    const [myReview] = data.filter((d) => { return id === d.patient_id });

    const patientReview = data.filter((d) => { return id !== d.patient_id });

    return res.status(200).json({ success: true, myReview, patientReview, id })

  }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}



exports.getBookingSlots = async (req, res) => {
  try {
    const doctor_id = req.params.id;
    let html = await this.specialitiesCombo();
    return res.render('pages/patientPanel/appointment', { html, doctor_id })

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// update become a doctor form

exports.knowStatus = async (req, res) => {
  const doctor_id = req.user.id
  try {
    const [status] = await conn.query(`select approved from doctor_details where doctor_id = ?;`, [doctor_id])
    return res.status(200).json(status)
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.updateBecomeDoctorDetails = async (req, res) => {
  try {
    res.render("pages/doctorPanel/becomeDoctorDetails")

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.updateBecomeDoctorData = async (req, res) => {
  const doctor_id = req.user.id
  try {
    const [result] = await conn.query(` select doctor_details.id as doctor_details_id,doctor_details.hospital_id,specialities.id as speciality_id, qualification, consultancy_fees,name as hospital_name,location,gst_no,city,pincode from doctor_details inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join specialities on doctor_has_specialities.speciality_id = specialities.id where doctor_details.doctor_id = ?;`, [doctor_id])
    res.status(200).json(result)
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


exports.updatePostBecomeDoctor = async (req, res) => {
  // console.log("kya hal chal");

  let { otherSpeciality, doctor_details_id, hospital_id, qualification, consultancy_fees, speciality_id, hospital_name, address, gst_no, city, pincode } = req.body
  const doctor_id = req.user.id

  if (!hospital_id || !speciality_id || !doctor_id) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!"
    })
  }

  try {
    try {
      await conn.query(`update clinic_hospitals set name = ?, location = ?, gst_no =?, city = ?, pincode = ? where clinic_hospitals.id = ? `, [hospital_name, address, gst_no, city, pincode, hospital_id])

    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (otherSpeciality) {
      // console.log("inside other speciality");
      try {
        const [newSpeciality] = await conn.query(
          `INSERT INTO specialities (speciality, approved) VALUES (?,?)`,
          [otherSpeciality, 0]
        );

        speciality_id = newSpeciality.insertId;

      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    try {
      const [result] = await conn.query(`update doctor_has_specialities set speciality_id = ? where doctor_id = ?`, [speciality_id, doctor_id])

    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    try {
      await conn.query(`update doctor_details set qualification = ?, consultancy_fees = ?, approved = ? where doctor_id =? and doctor_details.id = ?`, [qualification, consultancy_fees, 0, doctor_id, doctor_details_id])

    } catch (error) {

      logger.error(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// update become a doctor form

exports.knowStatus = async (req, res) => {
  const doctor_id = req.user.id
  try {
    const [status] = await conn.query(`select approved from doctor_details where doctor_id = ?;`, [doctor_id])
    return res.status(200).json(status)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}

exports.updateBecomeDoctorDetails = async (req, res) => {
  res.render("pages/doctorPanel/becomeDoctorDetails")
}

exports.updateBecomeDoctorData = async (req, res) => {
  const doctor_id = req.user.id
  try {
    const [result] = await conn.query(` select doctor_details.id as doctor_details_id,doctor_details.hospital_id,specialities.id as speciality_id, qualification, consultancy_fees,name as hospital_name,location,gst_no,city,pincode from doctor_details inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join specialities on doctor_has_specialities.speciality_id = specialities.id where doctor_details.doctor_id = ?;`, [doctor_id])
    res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.updatePostBecomeDoctor = async (req, res) => {

  const { doctor_details_id, hospital_id, qualification, consultancy_fees, speciality_id, hospital_name, address, gst_no, city, pincode } = req.body
  const doctor_id = req.user.id

  if (!hospital_id || !speciality_id || !doctor_id) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!"
    })
  }

  try {
    try {
      await conn.query(`update clinic_hospitals set name = ?, location = ?, gst_no =?, city = ?, pincode = ? where clinic_hospitals.id = ? `, [hospital_name, address, gst_no, city, pincode, hospital_id])

    } catch (error) {
      console.log(error);
      return res.status(403).json({
        success: false,
        message: error.message
      })
    }

    try {
      const [result] = await conn.query(`update doctor_has_specialities set speciality_id = ? where doctor_id = ?`, [speciality_id, doctor_id])
      // console.log(result);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: error.message
      })
    }

    try {
      await conn.query(`update doctor_details set qualification = ?, consultancy_fees = ?, approved = ? where doctor_id =? and doctor_details.id = ?`, [qualification, consultancy_fees, 0, doctor_id, doctor_details_id])

    } catch (error) {

      return res.status(403).json({
        success: false,
        message: error.message
      })
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
