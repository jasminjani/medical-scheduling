const conn = require("../config/dbConnection");

exports.patientAllAppointment = async (req, res) => {
  try {

    const { patient_id } = req.params;

    const sql = `SELECT users.id, users.fname, users.lname, users.email, users.gender, users.phone, users.city, users.dob, users.address, patient_details.blood_group FROM users JOIN patient_details ON users.id = patient_details.patient_id WHERE users.id = ?`;
    const [patientDetails] = await conn.query(sql, [patient_id])
    // await console.log(patientDetails);

    // const sql2 = ``;

    res.render('pages/adminPanel/patientAllAppointment', { patientDetails: patientDetails });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
};

exports.patientProfile = async (req, res) => {
  try {

    res.render("pages/patientPanel/patientProfile");


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.patientPastProfile = async (req, res) => {
  try {

    res.render("pages/patientPanel/patientPastBookings");


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.patientUpcomingBookings = async (req, res) => {
  try {

    const { patient_id } = req.params;

    try {
      const query = "select time_slots.id,time_slots.doctor_id,slot_bookings.patient_id,slot_bookings.booking_date,time_slots.date,DAYNAME(time_slots.date) as day,time_slots.start_time,time_slots.end_time,users.fname,users.lname,users.email,users.phone,doctor_details.qualification,doctor_details.approved,doctor_details.consultancy_fees,clinic_hospitals.name,clinic_hospitals.location,clinic_hospitals.pincode from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on time_slots.doctor_id = users.id inner join doctor_details on time_slots.doctor_id = doctor_details.doctor_id inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id where slot_bookings.patient_id=? and (slot_bookings.is_canceled = ? and slot_bookings.is_deleted = ?)  and time_slots.date >= CAST(NOW() as DATE)";

      const [data] = await conn.query(query, [patient_id, 0, 0]);

      return res.status(200).json({ success: true, message: data });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.patientPastBookings = async (req, res) => {
  try {

    const { patient_id } = req.params;

    try {
      const query = "select time_slots.id,time_slots.doctor_id,slot_bookings.patient_id, slot_bookings.booking_date, time_slots.date,DAYNAME(time_slots.date) as day, time_slots.start_time,time_slots.end_time,users.fname, users.lname,users.email,users.phone,doctor_details.qualification, doctor_details.approved,doctor_details.consultancy_fees,clinic_hospitals.name, clinic_hospitals.location,clinic_hospitals.pincode,prescriptions.id as prescription_id from slot_bookings left join prescriptions on prescriptions.booking_id = slot_bookings.id inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on time_slots.doctor_id = users.id inner join doctor_details on time_slots.doctor_id = doctor_details.doctor_id inner join clinic_hospitals on doctor_details.hospital_id = clinic_hospitals.id  where slot_bookings.patient_id = ? and slot_bookings.is_canceled = ? and slot_bookings.is_deleted = ? and time_slots.date < CAST(NOW() as DATE)";

      const [data] = await conn.query(query, [patient_id, 0,0]);

      return res.status(200).json({ success: true, message: data });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message })
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.patientPayments = async (req, res) => {
  try {
    // here patient_id is as id
    const { id } = req.user;
    // let id = 7;

    try {
      const query = 'select time_slots.doctor_id,time_slots.date,time_slots.start_time,time_slots.end_time, concat(users.fname," ",users.lname) as doctor_name,users.phone,users.email,payments.payment_amount ,payments.is_refunded from payments inner join time_slots on time_slots.id = payments.slot_id inner join users on time_slots.doctor_id = users.id where patient_id = ?'

      const [data] = await conn.query(query, [id]);

      return res.status(200).json({ success: true, message: data });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

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
      where patient_id = ? AND (users.fname LIKE '${searchedData}%' OR users.lname LIKE '${searchedData}%' OR users.email LIKE '${searchedData}%' OR users.email LIKE '${searchedData}%' OR  time_slots.start_time LIKE '${searchedData}%' OR time_slots.end_time LIKE '${searchedData}%' OR  payments.payment_amount LIKE '${searchedData}%')`;

      const [data] = await conn.query(query, [id, paymentStatus]);

      return res.status(200).json({ success: true, message: data });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.paymentHistory = async (req, res) => {
  await res.render('pages/patientPanel/paymentHistory');
}