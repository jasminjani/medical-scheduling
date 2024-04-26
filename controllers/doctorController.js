const conn = require('../config/dbConnection')
const logger = require('../utils/pino')

exports.doctorDashBoard = (req, res) => {
  res.render("pages/doctorPanel/doctorDashboard");
};

exports.doctorDisplay = async (req, res) => {
  await res.render("pages/doctorPanel/doctorViewProfile");
};

exports.updateGetDoctorDisplay = async (req, res) => {
  await res.render("pages/doctorPanel/doctorProfileUpdate");
};

exports.getDoctorReview = async (req, res) => {
  await res.render("pages/doctorPanel/doctorReview");
};

exports.getPatientDetail = async (req, res) => {
  await res.render("pages/doctorPanel/doctorPatientHistory");
};

exports.getPatientHistoryDetail = async (req, res) => {
  await res.render("pages/doctorPanel/doctorPatientDetails");
};

exports.becomeDoctorDetail = async (req, res) => {
  res.render("pages/doctorPanel/becomeDoctorDetails");
};

exports.logoutController = async (req, res) => {
  res.clearCookie("token");
  res.status(200).redirect("/login");
};

exports.dashBoardCount = async (req, res) => {
  let doctor_id = req.user.id;
  try {
    let [result] = await conn.query(
      `select sum(payment_amount) as revenue, count(patient_id) as patient, count(slot_id) as slot from payments where doctor_id = ? and is_refunded = ?;`,
      [doctor_id, 0]
    );
    res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.dashBoardReviews = async (req, res) => {
  let doctor_id = req.user.id;
  try {
    let [result] = await conn.query(
      `select concat(fname," ",lname) as Name,email,rating,review,profile_picture,convert(rating_and_reviews.created_at,date) as date from rating_and_reviews inner join users on rating_and_reviews.patient_id = users.id inner join profile_pictures on rating_and_reviews.patient_id = profile_pictures.user_id where doctor_id=? and profile_pictures.is_active = ?;`,
      [doctor_id, 1]
    );
    res.json(result);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.dashBoardAppointments = async (req, res) => {
  let doctor_id = req.user.id;
  try {
    let [result] = await conn.query(
      `select concat(fname," ",lname)as Name, concat(start_time," to ",end_time)as Appointment_time,slot_bookings.patient_id from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on slot_bookings.patient_id = users.id where doctor_id = ? and time_slots.date = curdate() and time_slots.is_booked = ?;`,
      [doctor_id, 1]
    );
    res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.dashBoardTodayAppointments = async (req, res) => {
  let doctor_id = req.user.id;
  try {
    let [result] = await conn.query(
      `select concat(users_patient.fname," ",users_patient.lname) as patient_name,slot_bookings.patient_id,
    concat(time_slots.start_time," ",time_slots.end_time) as appointment_time,slot_bookings.id as booking_id from slot_bookings
    join time_slots on time_slots.id=slot_bookings.slot_id
    join users as users_patient on slot_bookings.patient_id=users_patient.id
    left join prescriptions on prescriptions.booking_id=slot_bookings.id
    where time_slots.doctor_id=? && time_slots.date=curdate() && prescriptions.id is null && slot_bookings.is_canceled = 0 && slot_bookings.is_deleted=0`,
      [doctor_id]
    );

    res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    //doctor_id get token
    const doctor_id = req.user.id;

    const {
      speciality,
      name,
      location,
      gst_no,
      city,
      pincode,
      qualification,
      consultancy_fees,
    } = req.body;

    let hospital_id;

    // validte hospital_detail
    if (!name || !location || !gst_no || !city || !pincode) {
      return res.status(500).json({
        success: false,
        message: "Please fill Hospital details ",
      });
    }

    // validate doctor_details
    if (!doctor_id || !qualification || !consultancy_fees) {
      return res.status(500).json({
        success: false,
        message: "Please fill Doctor Details",
      });
    }

    // validate doctor_has_speciality
    if (!doctor_id || !speciality) {
      return res.status(500).json({
        success: false,
        message: "Please fill Speciality Details",
      });
    }

    try {
      const [result] = await conn.query(
        "select * from doctor_details where doctor_id = ?",
        [doctor_id]
      );

      if (result.length > 0) {
        return res.json({
          success: false,
          message: "Already Requested",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // doctor_id  last insreted user id
    // speciality_id dropdown selection speciality_table
    try {
      const [result] = await conn.query(
        `insert into clinic_hospitals (name,location,gst_no,city,pincode) values (?,?,?,?,?)`,
        [name, location, gst_no, city, pincode]
      );
      hospital_id = result.insertId;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    try {
      await conn.query(
        `insert into doctor_details (doctor_id,hospital_id,qualification,consultancy_fees) values (?,?,?,?)`,
        [doctor_id, hospital_id, qualification, consultancy_fees]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    try {
      await conn.query(
        `insert into doctor_has_specialities (doctor_id,speciality_id) values (?,?)`,
        [doctor_id, speciality]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "inserted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPendingDoctorById = async (req, res) => {
  try {
    let { id } = req.body;

    let [result] = await conn.query(
      "select * from doctor_details where doctor_id=?",
      [id]
    );

    if (result.length > 0) {
      return res.json({
        success: false,
        message: "User already requested",
      });
    }

    return res.json({
      success: true,
      message: "User not requested",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCityCombo = async (req, res) => {
  try {
    const [result] = await conn.query(`select * from cities order by city`);
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPatientData = async (req, res) => {
  const id = req.user.id;
  try {
    const [result] = await conn.query(
      `select slot_bookings.patient_id, concat(fname," ",lname)as name,phone from slot_bookings left join time_slots on slot_bookings.slot_id = time_slots.id inner join patient_details on slot_bookings.patient_id = patient_details.patient_id inner join users on patient_details.patient_id = users.id where time_slots.doctor_id = ? group by patient_details.id ;`,
      [id]
    );
    res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientHistoryData = async (req, res) => {
  try {
    const patient_id = req.params.patient_id;
    const doctor_id = req.user.id;
    const [result] = await conn.query(
      `select  date as "Appointment Date"  from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id where slot_bookings.patient_id = ? and time_slots.doctor_id = ? group by (date)`,
      [patient_id, doctor_id]
    );

    res.json(result);
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message,
    });
  }
};

exports.patientDetailsData = async (req, res) => {
  const patient_id = req.params.patient_id;
  const doctor_id = req.user.id;
  try {
    const [result] = await conn.query(
      `select concat(fname, " ", lname) as Name,profile_picture,gender as Gender, phone as Contact, email as Email,city as City, address as Address,blood_group as "Blood Group", dob as "Date of Birth" from slot_bookings inner join patient_details on slot_bookings.patient_id = patient_details.patient_id inner join users on patient_details.patient_id = users.id inner join time_slots on slot_bookings.slot_id = time_slots.id inner join profile_pictures on users.id = profile_pictures.user_id where slot_bookings.patient_id = ? and time_slots.doctor_id = ? limit 0,1;`,
      [patient_id, doctor_id]
    );
    res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientPrescriptionData = async (req, res) => {
  const patient_id = req.params.patient_id;
  const doctor_id = req.user.id;
  const date = req.params.date;

  try {
    const [result] = await conn.query(
      `select time_slots.start_time as "Start Time",time_slots.end_time as "End Time",prescriptions.diagnoses as "Diagnoses",prescriptions.prescription as "Prescriptions" from prescriptions inner join slot_bookings on prescriptions.booking_id = slot_bookings.id inner join time_slots on slot_bookings.slot_id =time_slots.id where prescriptions.patient_id = ? and prescriptions.doctor_id = ? and time_slots.date = ? and time_slots.is_booked = 1;`,
      [patient_id, doctor_id, date]
    );
    res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.doctorPanelPaymentHistory = async (req, res) => {
  await res.render("pages/doctorPanel/viewpayment");
};

exports.showpaymentHistory = async (req, res) => {
  try {
    let doctor_id = req.user.id;
    // let doctor_id = 2;

    if (!doctor_id) {
      return res.status(500).json({
        success: false,
        message: "doctor id not found",
      });
    }

    const sql = `SELECT time_slots.doctor_id, users.id AS patient_id, users.fname, users.lname, users.phone
    FROM time_slots
    JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id
    JOIN users ON slot_bookings.patient_id = users.id
    WHERE time_slots.doctor_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0 GROUP BY users.id`;

    const [patientHistory] = await conn.query(sql, [doctor_id]);

    res.send({ patientHistory: patientHistory });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.searchPaymentHistory = async (req, res) => {
  try {
    let doctor_id = req.user.id;
    // let doctor_id = 2;
    let { search } = req.params;

    if (!doctor_id) {
      return res.status(500).json({
        success: false,
        message: "doctor id not found",
      });
    }

    const sql = `SELECT time_slots.doctor_id, users.id AS patient_id, users.fname, users.lname, users.phone
    FROM time_slots
    JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id
    JOIN users ON slot_bookings.patient_id = users.id
    WHERE time_slots.doctor_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0
    AND (users.fname LIKE '${search}%' OR users.lname LIKE '${search}%' OR users.phone LIKE '${search}%')
    GROUP BY users.id`;

    const [patientHistory] = await conn.query(sql, [doctor_id]);

    res.send({ patientHistory: patientHistory });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientPaymentHistory = async (req, res) => {
  await res.render("pages/doctorPanel/patientPaymentHistory");
};

exports.showPatientPayment = async (req, res) => {
  try {
    let doctor_id = req.user.id;
    // let doctor_id = 2;
    let { patient_id } = req.params;

    if (!doctor_id || !patient_id) {
      return res.status(500).json({
        success: false,
        message: "doctor id or patient id not found",
      });
    }

    const sql = `SELECT  profile_pictures.profile_picture,time_slots.doctor_id, time_slots.date AS slote_date, time_slots.start_time, time_slots.end_time, slot_bookings.slot_id, slot_bookings.patient_id, slot_bookings.booking_date AS payment_date, payments.payment_amount, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group
    FROM time_slots
    LEFT JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id
    LEFT JOIN payments ON time_slots.id = payments.slot_id
    LEFT JOIN users ON slot_bookings.patient_id = users.id
    LEFT JOIN profile_pictures ON profile_pictures.user_id = users.id
    LEFT JOIN patient_details ON slot_bookings.patient_id = patient_details.patient_id
    WHERE time_slots.doctor_id = ? AND slot_bookings.patient_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0 AND profile_pictures.is_active = 1`;

    const [paymentDetails] = await conn.query(sql, [doctor_id, patient_id]);

    res.send({ paymentDetails: paymentDetails });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// This controller is for searching in particular patient payment history table but not in use
exports.searchPatientPayment = async (req, res) => {
  try {
    let doctor_id = req.user.id;
    // let doctor_id = 2;
    let { search } = req.params;
    let { patient_id } = req.params;

    if (!doctor_id || !patient_id) {
      return res.status(500).json({
        success: false,
        message: "doctor id or patient id not found",
      });
    }

    const sql = `SELECT profile_pictures.profile_picture, time_slots.doctor_id, time_slots.date AS slote_date, time_slots.start_time, time_slots.end_time, slot_bookings.slot_id, slot_bookings.patient_id, slot_bookings.booking_date AS payment_date, payments.payment_amount, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group
    FROM time_slots
    LEFT JOIN slot_bookings ON time_slots.id = slot_bookings.slot_id
    LEFT JOIN payments ON time_slots.id = payments.slot_id
    LEFT JOIN users ON slot_bookings.patient_id = users.id
    LEFT JOIN profile_pictures ON profile_pictures.user_id = users.id
    LEFT JOIN patient_details ON slot_bookings.patient_id = patient_details.patient_id
    WHERE time_slots.doctor_id = ? AND slot_bookings.patient_id = ? AND time_slots.is_booked = 1 AND time_slots.is_deleted = 0
    AND (time_slots.date LIKE '${search}%' OR time_slots.start_time LIKE '${search}%' OR time_slots.end_time LIKE '${search}%' OR slot_bookings.booking_date LIKE '${search}%' OR payments.payment_amount LIKE '${search}%')`;

    const [paymentDetails] = await conn.query(sql, [doctor_id]);

    res.send({ paymentDetails: paymentDetails });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.doctorData = async (req, res) => {
  try {
    // doctor_id get token
    const doctor_id = req.user.id;
    const [result] = await conn.query(
      `select doctor_details.id,clinic_hospitals.id as hospital_id,concat(fname," ",lname) as Name,email as Email,gender as Gender,dob as "Date of Birth",phone as Contact,address as Address,name as "Hospital Name",location as "Hospital Address",gst_no as "GST No",clinic_hospitals.city as City,pincode as Pincode,speciality as Speciality,qualification as Qualificaiton,consultancy_fees as "Consultancy Fees" from doctor_details inner join users on  doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join clinic_hospitals on clinic_hospitals.id = doctor_details.hospital_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id where doctor_details.doctor_id = ?;`,
      [doctor_id]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateGetDoctorData = async (req, res) => {
  try {
    // doctor_id get token
    const doctor_id = req.user.id;

    const [result] = await conn.query(
      `select specialities.id as speciality,doctor_details.id, doctor_details.doctor_id,clinic_hospitals.id as hospital_id, fname,lname,email,gender,dob,phone,profile_picture,address,name,location,gst_no,clinic_hospitals.city,pincode, qualification, consultancy_fees from doctor_details inner join users on  doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join profile_pictures on users.id = profile_pictures.user_id inner join clinic_hospitals on clinic_hospitals.id = doctor_details.hospital_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id where doctor_details.doctor_id = ? and profile_pictures.is_active = ?;`,
      [doctor_id, 1]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDoctorDetails = async (req, res) => {
  //doctor_id get token
  console.log(req.body);
  let doctor_id = req.user.id;
  const {
    fname,
    lname,
    dob,
    gender,
    phone,
    address,
    name,
    location,
    gst_no,
    city,
    pincode,
    qualification,
    consultancy_fees,
    id,
    hospital_id,
    speciality,
  } = req.body;
  let profile_picture = req.file?.filename || "";

  // validate
  if (!id) {
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }

  try {
    try {
      await conn.query(
        `update users set fname = ?,lname = ?,dob=?,gender=?,phone = ?,address = ? where users.id = ? and role_id = ?`,
        [fname, lname, dob, gender, phone, address, doctor_id, 2]
      );
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: error.message,
      });
    }

    if (!hospital_id) {
      return res.status(500).json({
        success: false,
        message: "Internal server Error",
      });
    }

    try {
      await conn.query(
        `update clinic_hospitals set name = ?, location = ?, gst_no =?,city = ?,pincode =? where clinic_hospitals.id = ?`,
        [name, location, gst_no, city, pincode, hospital_id, doctor_id]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    try {
      await conn.query(
        `update doctor_details set qualification = ?,consultancy_fees= ? where doctor_details.id = ? and doctor_id = ?`,
        [qualification, consultancy_fees, id, doctor_id]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    try {
      await conn.query(
        `update doctor_has_specialities set speciality_id = ? where  doctor_id =?`,
        [speciality, doctor_id]
      );
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: error.message,
      });
    }

    if (!profile_picture == "") {
      try {
        await conn.query(
          `update profile_pictures set is_active = ? where user_id = ?`,
          [0, doctor_id]
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
          [profile_picture, doctor_id]
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
      .json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


exports.searchReview = async (req, res) => {
  let doctor_id = req.user.id;
  let search = req.params.search;
  try {
    let [result] = await conn.query(
      ` select concat(fname," ",lname) as name, rating_and_reviews.rating, rating_and_reviews.review ,convert(rating_and_reviews.created_at,date) as date from rating_and_reviews inner join users on rating_and_reviews.patient_id = users.id where (fname like "${search}%" or lname like "${search}%") and rating_and_reviews.doctor_id = ?; `,
      [doctor_id]
    );
    res.status(200).json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPatientSearchData = async (req, res) => {
  const doctor_id = req.user.id;
  let search = req.params.search;
  try {
    const [result] = await conn.query(
      `select slot_bookings.patient_id, concat(fname," ",lname)as name,phone from slot_bookings left join time_slots on slot_bookings.slot_id = time_slots.id inner join patient_details on slot_bookings.patient_id = patient_details.patient_id inner join users on patient_details.patient_id = users.id where (fname like "${search}%" or lname like "${search}%") and time_slots.doctor_id = ? group by patient_details.id;`,
      [doctor_id]
    );
    res.json(result);
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDoctorSideBarDetail = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const [result] = await conn.query(
      `select concat(fname, " ",lname) as name,profile_picture,email from users inner join profile_pictures on users.id = profile_pictures.user_id where role_id = ? and users.id = ? and profile_pictures.is_active = ?;`,
      [2, doctor_id, 1]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.allSpecialities = async (req, res) => {
  try {
    [result] = await conn.query(
      `select id as speciality_id,speciality from specialities where approved = 1`
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// FOR CREATING NEW HOSPITAL - DOCTOR WILL ENTER AND ADMIN WILL VERIFY
exports.createHospital = async (req, res) => {
  try {
    let { name, location, gstNo, city, pincode } = req.body;

    if (!name || !location || !gstNo || !city || !pincode) {
      return res.status(500).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const sql = `INSERT INTO clinic_hospitals (name, location, gst_no, city, pincode) VALUES (?, ?, ?, ?, ?)`;
    const [createHospital] = await conn.query(sql, [
      name,
      location,
      gstNo,
      city,
      pincode,
    ]);
    res.send(createHospital);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.home = async (req, res) => {
  try {
    let {patient_id,booking_id}=req.params;
    return res.render("pages/Prescription/createPrescription.ejs",{patient_id,booking_id});
  } catch (error) {
    console.log(error.message);
  }
};

exports.updateDetailsData = async (req, res) => {
  try {
    const id = req.params.id;
    let query = `select concat(users.fname," ",users.lname) as patient_name,convert(prescriptions.created_at,date) as appointment_date,diagnoses,prescription from prescriptions join users on prescriptions.patient_id= users.id where prescriptions.id=?`;
    let [result] = await conn.query(query, [id]);
    res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const { patient_id, prescription, diagnosis, booking_id } = req.body;

    const query = `INSERT INTO prescriptions(doctor_id,patient_id,prescription,diagnoses,booking_id) values (?,?,?,?,?)`;

    if (prescription && diagnosis) {
      let result = await conn.query(query, [
        doctor_id,
        patient_id,
        prescription,
        diagnosis,
        booking_id,
      ]);
      const insert_id = JSON.stringify(result[0].insertId);
      res.json({
        msg: "Prescription Added Successfully",
        insert_id,
      });
    } else {
      res.json({
        msg: "Please enter diagnosis & prescription!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    console.log("in updateprescription");
    const id = req.params.id;
    const { prescription, diagnosis } = req.body;
    let query = `UPDATE prescriptions SET diagnoses=?,prescription=? where id=? `;
    let result = await conn.query(query, [diagnosis, prescription, id]);
    res.json({
      msg: "Updation in prescriptions completed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPrescriptionOfDoctor = async (req, res) => {
  try {
    const id = req.user.id;

    const query = `select prescriptions.created_at,prescriptions.diagnoses,prescriptions.id,concat(users.fname," ",users.lname) as patient_name from prescriptions join users on prescriptions.patient_id= users.id where doctor_id=? order by prescriptions.created_at desc`;
    const [result2] = await conn.query(query, [id]);
    return res.status(200).json({ success: true, result: result2 });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  0;
};

exports.editPrescriptionHome = async (req, res) => {
  try {
    const id = req.params.id;
    return res.render("pages/Prescription/editPrescription.ejs", { id });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showDetails = async (req, res) => {
  try {
    // A7 params patient_id
    const id = req.params.patient_id;
    const query = `SELECT
    users.id,
    users.fname,
    users.lname,
    users.email,
    users.phone,
    users.gender,
    users.dob,
    users.city,
    users.address,
    profile_pictures.profile_picture,
    COALESCE(patient_details.blood_group, 'Not Specified') AS blood_group
    FROM users
    LEFT JOIN
    patient_details ON users.id = patient_details.patient_id
    join profile_pictures on profile_pictures.user_id=users.id
    WHERE
    users.id = ?`;
    const [result] = await conn.query(query, [id]);
    // console.log(result);
    res.json(result);
    // res.render("pages/createPrescription.ejs", { result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createSlotsPage = async (req, res) => {
  try {
    res.render("pages/slotPanel/addSlots");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.allPatientPriscription = async (req, res) => {
  try {
    return res.render("pages/Prescription/prescriptionOfAllPatient.ejs");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getPrescriptionOfUser = async (req, res) => {
  try {
    const id = req.user.id;

    const query = `select prescriptions.created_at,prescriptions.id,prescriptions.diagnoses,fname,lname,doctor_id from prescriptions join users on prescriptions.doctor_id = users.id where patient_id=?`;
    const result = await conn.query(query, [id]);
    return res.status(200).json({ success: true, message: result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Doctors can create slots
exports.createSlots = async (req, res) => {
  try {
    const { day1, day2, day3, day4, day5, day6, day7 } = req.body;
    const doctor_id = req.user.id;
    const dayArray = [day1, day2, day3, day4, day5, day6, day7];

    for (let i = 0; i < 7; i++) {
      if (dayArray[i].length > 1) {
        for (let j = 1; j < dayArray[i].length; j++) {
          if (dayArray[i][j]) {
            const slot = dayArray[i][j].split("-");
            const start_time = slot[0].trim();
            const end_time = slot[1].trim();

            try {
              const query =
                "select * from time_slots where doctor_id = ? and date = ? and end_time <= ?";

              const [isValid] = await conn.query(query, [
                doctor_id,
                dayArray[i][0],
                start_time,
              ]);
            } catch (error) {
              return res
                .status(500)
                .json({ success: false, message: error.message });
            }

            try {
              const query =
                "insert into time_slots (`doctor_id`,`date`,`start_time`,`end_time`) values (?,?,?,?)";

              const [slots] = await conn.query(query, [
                doctor_id,
                dayArray[i][0],
                start_time,
                end_time,
              ]);
            } catch (error) {
              return res
                .status(500)
                .json({ success: false, message: error.message });
            }
          }
        }
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "slots created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Slot Page Render
exports.getUpcomingSlotPage = async (req, res) => {
  try {
    res.render("pages/slotPanel/upcomingSlots");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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
    // const { doctor_id } = req.params;
    const doctor_id = req.user.id;

    try {
      const query =
        "SELECT DISTINCT date as dates,DAYNAME(date) as day from time_slots where doctor_id = ? and is_deleted = ? and date >= CAST(NOW() as DATE) order by dates limit 7";

      const [data] = await conn.query(query, [doctor_id, 0]);

      return res.status(200).json({ success: true, message: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Doctors can get all upcoming slots
exports.getAllSlots = async (req, res) => {
  try {
    // const { doctor_id, date } = req.params;
    const { date } = req.params;
    const doctor_id = req.user.id;
    // console.log(doctor_id);
    try {
      // const query = 'SELECT time_slots.id,time_slots.date,time_slots.start_time,time_slots.end_time,users.fname as patient_name,users.phone FROM time_slots left join slot_bookings on time_slots.id = slot_bookings.slot_id left join users on slot_bookings.patient_id = users.id where time_slots.doctor_id = ? and time_slots.date >= CAST(NOW() as DATE) and time_slots.is_deleted = ? and date = ? and slot_bookings.is_canceled != ? order by time_slots.date';

      const query =
        'select slot_bookings.is_canceled,time_slots.is_booked, time_slots.id, time_slots.start_time,time_slots.end_time, concat(users.fname," ",users.lname) as patient_name,users.phone from time_slots  left join slot_bookings on time_slots.id =  slot_bookings.slot_id left join users on slot_bookings.patient_id = users.id where time_slots.date = ? and time_slots.is_deleted = ? and time_slots.doctor_id = ?';

      const [data] = await conn.query(query, [date, 0, doctor_id]);

      return res.status(200).json({ success: true, message: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Doctors can delete slots
exports.deleteSlot = async (req, res) => {
  try {
    // const { doctor_id, slot_id } = req.params;
    const { slot_id } = req.params;
    const doctor_id = req.user.id;
    try {
      const query =
        "select * from time_slots where doctor_id = ? and id = ? and is_deleted = ?";

      const [checkSlot] = await conn.query(query, [doctor_id, slot_id, 0]);

      if (checkSlot.length === 0)
        return res
          .status(500)
          .json({ success: false, message: "you can not cancel this slot" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }

    try {
      const query =
        "update time_slots set is_deleted = ?,deleted_at = NOW() where id = ?";

      const [deleted] = await conn.query(query, [1, slot_id]);
    } catch (error) {
      console.log(error);

      return res.status(500).json({ success: false, message: error.message });
    }

    try {
      const query =
        "update slot_bookings set is_deleted = ?,deleted_at = NOW() where slot_id = ?";

      const [deleted] = await conn.query(query, [1, slot_id]);
    } catch (error) {
      console.log(error);

      return res.status(500).json({ success: false, message: error.message });
    }

    try {
      const query = "update payments set is_refunded = ? where slot_id = ?";

      const [refunded] = await conn.query(query, [1, slot_id]);

      // return res.status(200).json({ success: true, message: "slot deleted successfully" });
      res.redirect("/doctor/upcomingSlots");
    } catch (error) {
      console.log(error);

      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
