const conn = require("../config/dbConnection.js");

exports.doctorDashBoard = (req, res) => {
  res.render("pages/doctorPanel/dashboard");
};

exports.getDoctorSideBarDetail = async (req, res) => {
  try {
    //doctor_id get token
    
    const doctor_id = req.user.id;
    const id = req.params.id;
    const [result] = await conn.query(
      `select concat(fname, " ",lname) as name,profile_picture,email from users inner join profile_pictures on users.id = profile_pictures.user_id where role_id = ? and users.id = ? and profile_pictures.is_active = ?;`,
      [2, doctor_id,1]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.allDoctor = async (req, res) => {
  try {
    [result] =
      await conn.query(`select fname, lname, email, gender, phone,  name, location, gst_no, users.city, pincode,speciality from doctor_details inner join users on doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id inner join clinic_hospitals on  doctor_details.hospital_id = clinic_hospitals.id
     where users.role_id = 2`);
    res.send(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    //doctor_id get token
    const doctor_id = req.user.id;

    const { speciality, name, location, gst_no, city, pincode, qualification, consultancy_fees } = req.body
    let hospital_id

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

exports.updateDoctorDetails = async (req, res) => {
  //doctor_id get token
  let doctor_id = req.user.id
  const { fname, lname, dob, gender, phone, address, name, location, gst_no, dcity, city, pincode, qualification, consultancy_fees, id, hospital_id, speciality } = req.body;
  let profile_picture = req.file?.filename || ""
  
  // validate
  if (!id) {
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }

  try {
    try {
      await conn.query(`update users set fname = ?,lname = ?,dob=?,gender=?,phone = ?,address = ? where users.id = ? and role_id = ?`, [fname, lname, dob, gender, phone, address,  doctor_id, 2])
    }
    catch (error) {
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

    if(!profile_picture == ""){
      try{
        await conn.query(`update profile_pictures set is_active = ? where user_id = ?`,[0,doctor_id])
      }
      catch(error){
        return res.json({
          success: false,
          message: error.message
        })
      }

      try {
      await conn.query(
        `insert into profile_pictures (profile_picture,user_id) values (?,?)`,[profile_picture,doctor_id]
      )
    } catch (error) {
      return res.json({
        success: false,
        message:error.message
      })
    }
   }

    res.json({ success: true, message: "Update Successfully" });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// render controller date: 12-04-2024

exports.doctorDisplay = async (req, res) => {
  await res.render("pages/doctorPanel/doctorprofile");
};

exports.updateGetDoctorDisplay = async (req, res) => {
  await res.render('pages/doctorPanel/editprofile')
}

exports.getPaymentHistory = async (req, res) => {
  await res.render('pages/doctorPanel/viewpayment')
}

exports.getDoctorReview = async (req, res) => {
  await res.render('pages/doctorPanel/viewfeedback')
}

exports.getPatientDetail = async (req, res) => {
  req.params.id
  await res.render('pages/doctorPanel/patienthistory')
}

exports.getPatientHistoryDetail = async (req, res) => {
  req.params.patient_id
  await res.render('pages/doctorPanel/patientDetail')
}


// json controller

exports.getPatientData = async (req, res) => {
  const id = req.user.id
  try {
    const [result] = await conn.query(`select slot_bookings.patient_id, concat(fname," ",lname)as name,phone from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id inner join patient_details on slot_bookings.patient_id = patient_details.patient_id inner join users on patient_details.patient_id = users.id where time_slots.doctor_id = ? group by patient_details.id;`, [id])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}

exports.doctorData = async (req, res) => {
  try {
    // doctor_id get token
    const doctor_id = req.user.id
    console.log(doctor_id);
    const [result] = await conn.query(`select doctor_details.id,clinic_hospitals.id as hospital_id,concat(fname," ",lname) as Name,email as Email,gender as Gender,dob as "Date of Birth",phone as Contact,address as Address,name as "Hospital Name",location as "Hospital Address",gst_no as "GST No",clinic_hospitals.city as City,pincode as Pincode,speciality as Speciality,qualification as Qualificaiton,consultancy_fees as "Consultancy Fees" from doctor_details inner join users on  doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join clinic_hospitals on clinic_hospitals.id = doctor_details.hospital_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id where doctor_details.doctor_id = ?;`, [doctor_id])
    res.json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.becomeDoctorDetail = async (req, res) => {
  res.render("pages/doctorPanel/doctorDetails");
};

exports.updateGetDoctorData = async (req, res) => {
  try {
    // doctor_id get token
    const doctor_id = req.user.id

    const [result] = await conn.query(`select specialities.id as speciality,doctor_details.id, doctor_details.doctor_id,clinic_hospitals.id as hospital_id, fname,lname,email,gender,dob,phone,profile_picture,address,name,location,gst_no,clinic_hospitals.city,pincode, qualification, consultancy_fees from doctor_details inner join users on  doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join profile_pictures on users.id = profile_pictures.user_id inner join clinic_hospitals on clinic_hospitals.id = doctor_details.hospital_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id where doctor_details.doctor_id = ? and profile_pictures.is_active = ?;`, [doctor_id,1])
    res.json(result)


  } catch (error) {
    return res.status(500).json({
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

exports.doctorPaymentData = async (req, res) => {
  try {
    const id = req.user.id
    const [result] = await conn.query(`select concat(fname ," ", lname) as name,payment_amount, concat(start_time," to ",end_time) as SlotTime, date,payments.created_at as PaymentDate from payments inner join time_slots on payments.slot_id = time_slots.id inner join users on payments.patient_id = users.id where payments.doctor_id=?;`, [id])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
};

exports.doctorReviewData = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    let [data] = await conn.query(`select concat(fname," ",lname) as name, rating_and_reviews.rating, rating_and_reviews.review ,convert(rating_and_reviews.created_at,date) as date from rating_and_reviews inner join users on rating_and_reviews.patient_id = users.id where rating_and_reviews.doctor_id = ?`, [doctor_id]);
    res.json(data)
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.patientHistoryData = async (req, res) => {
  try {
    console.log("Hello");
    const patient_id = req.params.patient_id
    const doctor_id = req.user.id
    const [result] = await conn.query(`select  date as "Appointment Date"  from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id where slot_bookings.patient_id = ? and time_slots.doctor_id = ? group by (date)`, [patient_id, doctor_id])

    res.json(result)
  } catch (error) {
    console.log(error);
    return res.json({
      message: error.message
    })
  }
}

exports.patientDetailsData = async (req, res) => {
  const patient_id = req.params.patient_id
  const doctor_id = req.user.id

  try {
    const [result] = await conn.query(`select concat(fname, " ", lname) as Name,profile_picture,gender as Gender, phone as Contact, email as Email,city as City, address as Address,blood_group as "Blood Group", dob as "Date of Birth" from slot_bookings inner join patient_details on slot_bookings.patient_id = patient_details.patient_id inner join users on patient_details.patient_id = users.id inner join time_slots on slot_bookings.slot_id = time_slots.id inner join profile_pictures on users.id = profile_pictures.user_id where slot_bookings.patient_id = ? and time_slots.doctor_id = ? limit 0,1;`,[patient_id,doctor_id])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}

exports.patientPrescriptionData = async (req, res) => {
  const patient_id = req.params.patient_id
  const doctor_id = req.user.id
  const date = req.params.date

  try {
    const [result] = await conn.query(`select time_slots.start_time,time_slots.end_time,prescriptions.prescription,prescriptions.diagnoses from prescriptions inner join time_slots on prescriptions.slot_id = time_slots.id where prescriptions.patient_id = ? and prescriptions.doctor_id = ? and time_slots.date = ?;`, [patient_id, doctor_id, date])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}

exports.logoutController = async (req, res) => {
  res.clearCookie('token')
  res.status(200).redirect('/login')
}

exports.dashBoardCount = async(req,res)=>{
  let doctor_id = req.user.id
  try {
    let [result] = await conn.query(`select sum(payment_amount) as revenue, count(patient_id) as patient, count(slot_id) as slot from payments where doctor_id = 3 and is_refunded = 0;`,[doctor_id]);
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}




exports.dashBoardReviews = async(req,res)=>{
  let doctor_id = req.user.id
  try {
    let [result] = await conn.query(`select concat(fname," ",lname) as Name,email,rating,review,profile_picture from rating_and_reviews inner join users on rating_and_reviews.patient_id = users.id inner join profile_pictures on rating_and_reviews.patient_id = profile_pictures.user_id where doctor_id=? and profile_pictures.is_active = ?;`,[doctor_id,1])
    res.json(result)
  } catch (error) {
     return res.json({success: false,
    message: error.message
  })
}
}

exports.dashBoardAppointments = async(req,res)=>{
  let doctor_id = req.user.id
  try {
    let [result] = await conn.query(`select concat(fname," ",lname)as Name, concat(start_time," to ",end_time)as Appointment_time,slot_bookings.patient_id from slot_bookings inner join time_slots on slot_bookings.slot_id = time_slots.id inner join users on slot_bookings.patient_id = users.id where doctor_id = ? and time_slots.date = curdate() and time_slots.is_booked = ?;`,[doctor_id,1])
    res.json(result)
  } catch (error) {
    return res.json({
      success:false,
      message:error.message
    })
  }
}