const conn = require('../config/dbConnection')
const logger = require('../utils/pino')

exports.dashboardStatus = async (req, res) => {
  try {
    const sql = `SELECT count(*) AS total_doctor FROM users WHERE is_deleted = 0 AND role_id = 2 AND is_active = 1`;
    const [totalDoctor] = await conn.query(sql);

    const sql2 = `SELECT count(*) AS total_patient FROM users WHERE is_deleted = 0 AND role_id = 1 AND is_active = 1`;
    const [totalPatient] = await conn.query(sql2);

    let date = new Date();
    let fullDate = date.toISOString().slice(0, 10);

    const sql3 = `SELECT count(*) AS today_appointment FROM slot_bookings JOIN time_slots ON slot_bookings.slot_id = time_slots.id WHERE slot_bookings.is_deleted = 0 AND slot_bookings.is_canceled = 0 AND time_slots.date = ?`;
    const [todayAppointment] = await conn.query(sql3, [fullDate]);

    const sql4 = `SELECT sum(payment_amount) AS total_revenue FROM payments WHERE is_refunded = 0`;
    const [totalRevenue] = await conn.query(sql4);
    totalRevenue[0].total_revenue
      ? totalRevenue[0].total_revenue
      : (totalRevenue[0].total_revenue = 0);
    res.send({
      totalDoctor: totalDoctor,
      totalPatient: totalPatient,
      todayAppointment: todayAppointment,
      totalRevenue: totalRevenue,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.contactToAdmin = async (req, res) => {
  try {
    res.render('pages/adminPanel/adminContact')
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getAllMessage = async (req, res) => {
  try {
    let [result] = await conn.query('select * from contact_us');
    res.json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


exports.getAllDoctors = async (req, res) => {
  try {
    const sql2 = `select * from users a 
    inner join doctor_details b on a.id = b.doctor_id 
    inner join clinic_hospitals c on b.hospital_id = c.id  order by a.id`;

    const [result] = await conn.query(sql2);
    res.json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {

    const docID = req.params.id;

    const sql = `update doctor_details JOIN users ON doctor_details.doctor_id = users.id set doctor_details.approved = -1, users.role_id = 1 where doctor_details.doctor_id = ?`;
    let [result] = await conn.query(sql, [docID]);

    res.status(200).json();
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.individualDoctor = async (req, res) => {
  try {
    const docID = req.params.id;

    let sql = `select a.fname,a.lname,a.email,a.phone,a.gender,a.dob,b.qualification,a.address,
    c.name,c.location,c.city,c.gst_no from users a 
    inner join doctor_details b on a.id = b.doctor_id 
    inner join clinic_hospitals c on b.hospital_id = c.id
    where b.approved in (-1,0) and a.id = ?`;

    let [result] = await conn.query(sql, [docID]);

    if (result.length === 0) {
      res.send("not valid doctor");
    } else {
      res.json({ result });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.individualDoctorRend = async (req, res) => {
  try {
    const docID = req.params.id;
    res.render("pages/adminPanel/adminApproveSpecificDoctor.ejs", { docID });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showDoctorDetail = async (req, res) => {
  try {
    const docID = req.params.id;

    let sql = `select a.fname,a.lname,a.email,a.phone,a.gender,a.dob,b.qualification,a.address,
    c.name,c.location,c.city,c.gst_no from users a 
    inner join doctor_details b on a.id = b.doctor_id 
    inner join clinic_hospitals c on b.hospital_id = c.id
    where b.approved = 1 and a.id = ?`;

    let [result] = await conn.query(sql, [docID]);

    if (result.length === 0) {
      res.send("not valid doctor");
    } else {
      res.json({ result });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showDoctorDetailRend = async (req, res) => {
  try {
    const docID = req.params.id;
    res.render("pages/adminPanel/adminShowOneDoc.ejs", { docID });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.approveDoctor = async (req, res) => {
  try {
    const docID = req.params.id;

    let sql1 = `update doctor_details set approved=1 where doctor_id =? and approved in (-1,0)`;
    let sql2 = `update users set role_id = 2 where id = ? and role_id =1`;

    await conn.query(sql1, [docID]);
    await conn.query(sql2, [docID]);

    res.status(200).send();
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectDoctor = async (req, res) => {
  try {
    const docID = req.params.id;

    let sql1 = `update doctor_details set approved=-1 where doctor_id =? and approved=0`;

    await conn.query(sql1, [docID]);

    res.status(200).send();
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSpecialties = async (req, res) => {
  try {
    const [result] = await conn.query(
      "select id,speciality from specialities where approved = 1"
    );

    res.json(result);
  } catch (error) {
    logger.error(error.message);
  }
};

exports.deleteSpecialty = async (req, res) => {
  try {
    await conn.query("update specialities set approved = 0 where id = ?", [
      req.body.id,
    ]);
    res.status(200).send();
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getNewSpecialties = async (req, res) => {
  try {
    const [result] = await conn.query(
      "select id,speciality from specialities where approved = 0"
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

exports.addNewSpecialties = async (req, res) => {
  try {
    await conn.query("update specialities set approved = 1 where id = ?", [
      req.body.id,
    ]);
    res.status(200).send();
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.adminDashboard = (req, res) => {
  try {
    res.render("pages/adminPanel/adminDashboard");

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.adminDeleteDoctors = (req, res) => {
  try {
    res.render("pages/adminPanel/adminApproveDoc");

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.adminApproveDoctors = (req, res) => {
  try {
    res.render("pages/adminPanel/adminApproveDoc");
    
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.adminGetAllPatients = (req, res) => {
  try {
    res.render("pages/adminPanel/adminShowPatient");

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.adminAddSpecialites = (req, res) => {
  try {
    res.render("pages/adminPanel/addDocSpecialty");

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.displayAllPatient = async (req, res) => {
  try {
    res.render("pages/adminPanel/allPatientDetail");
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const sql = `SELECT id, fname, lname, email FROM users WHERE role_id = 1`;
    const [allPatient] = await conn.query(sql);

    res.json(allPatient);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.searchPatientByName = async (req, res) => {
  try {
    let { searchedName } = req.params;

    if (searchedName == "null") {
      searchedName = "";
    }

    const sql = `SELECT id, fname, lname, email FROM users WHERE role_id = 1 AND (fname LIKE '${searchedName}%' OR lname LIKE '${searchedName}%' OR email LIKE '${searchedName}%')`;
    const [searchedPatient] = await conn.query(sql);
    res.send({ allPatient: searchedPatient });
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
    res.render("pages/adminPanel/patientAllAppointment");
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPatientAllAppointment = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(500).json({
        success: false,
        message: "patient id not found",
      });
    }

    // try {
    const sql = `SELECT users.id, users.is_deleted, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group, profile_pictures.profile_picture
      FROM users 
      LEFT JOIN patient_details ON users.id = patient_details.patient_id 
      LEFT JOIN profile_pictures ON users.id = profile_pictures.user_id
      WHERE users.id = ? AND profile_pictures.is_active = 1`;
    const [patientDetails] = await conn.query(sql, [patient_id]);
    // } catch (error) {
    //   logger.error(error.message);
    //   return res.status(500).json({
    //     success: false,
    //     message: error.message
    //   })
    // }

    // try {
    const sql2 = `SELECT users.fname, users.lname, slot_bookings.slot_id, time_slots.doctor_id, specialities.speciality, time_slots.date
      FROM slot_bookings JOIN time_slots ON slot_bookings.slot_id = time_slots.id
      JOIN users ON time_slots.doctor_id = users.id 
      JOIN doctor_has_specialities ON time_slots.doctor_id = doctor_has_specialities.doctor_id 
      JOIN specialities ON doctor_has_specialities.speciality_id = specialities.id 
      where slot_bookings.patient_id = ?`;

    const [allAppointment] = await conn.query(sql2, [patient_id]);

    // } catch (error) {
    // logger.error(error.message);
    //   return res.status(500).json({
    //     success: false,
    //     message: error.message
    //   })
    // }
    res.json({
      patientDetails: patientDetails,
      allAppointment: allAppointment,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {

    let { patient_id, activeStatus } = req.body;

    if (!patient_id || !activeStatus) {
      res.status(500).json({
        success: false,
        message: "patient id or patient active status not found"
      })
    }
    if (activeStatus == 0) {
      activeStatus = 1;
    } else if (activeStatus == 1) {
      activeStatus = 0;
    }

    // console.log("patient id ", patient_id);
    // console.log("status  ", activeStatus);

    const sql = `UPDATE users SET is_deleted = ? WHERE id = ?`;

    const [updatePatient] = await conn.query(sql, [activeStatus, patient_id]);

    res.status(200).send();

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.appointmentDetails = async (req, res) => {
  try {
    let { slot_id } = req.body;

    if (!slot_id) {
      return res.status(500).json({
        success: false,
        message: "slot id not found",
      });
    }

    const sql3 = `SELECT slot_bookings.patient_id, users.fname, users.lname, slot_bookings.slot_id, 
    time_slots.doctor_id, specialities.speciality, clinic_hospitals.name, time_slots.date, 
    payments.payment_amount, payments.is_refunded, time_slots.start_time, time_slots.end_time, 
    prescriptions.prescription, prescriptions.diagnoses FROM slot_bookings 
    inner JOIN time_slots ON slot_bookings.slot_id = time_slots.id 
    inner JOIN doctor_has_specialities ON time_slots.doctor_id = doctor_has_specialities.doctor_id 
    inner JOIN specialities ON doctor_has_specialities.speciality_id = specialities.id 
    inner JOIN doctor_details ON time_slots.doctor_id = doctor_details.doctor_id 
    inner JOIN clinic_hospitals ON doctor_details.hospital_id = clinic_hospitals.id 
    inner JOIN users ON time_slots.doctor_id = users.id 
    inner JOIN payments ON slot_bookings.slot_id = payments.slot_id 
    LEFT JOIN prescriptions ON prescriptions.booking_id = slot_bookings.id
    WHERE slot_bookings.slot_id = ?;`;

    const [appointmentData] = await conn.query(sql3, [slot_id]);

    res.send({ appointmentData: appointmentData });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

