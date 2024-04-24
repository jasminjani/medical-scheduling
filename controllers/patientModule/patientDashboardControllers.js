
const conn = require('../../config/dbConnection')

exports.patientDashboard = (req, res) => {

  res.render('pages/patientPanel/patientDashboard');
}


exports.patientStatus = async (req, res) => {

  let id = req.params.id;
  let date = new Date();
  // let fullDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  let fullDate = date.toISOString().slice(0, 10);
  // console.log(fullDate);

  let [doctorCount] = await conn.query('select count(*) doctorCount from doctor_details where approved =1');
  let [patientCount] = await conn.query('select count(*) patientCount from users where role_id = 1')
  let [patientTotalBooking] = await conn.query('select count(*) patientTotalBooking from slot_bookings where patient_id = ?', [id])
  let [TodaysBooking] = await conn.query(`select count(*) TodaysBooking from slot_bookings a
  join time_slots b on a.slot_id = b.id   where b.date = ? and a.patient_id = ?`, [fullDate, id])

  res.json([
    doctorCount[0],
    patientCount[0],
    patientTotalBooking[0],
    TodaysBooking[0]
  ]);
}



exports.addPatientDetails = async (req, res) => {
  try {
    const {patientId,bloodgroup} = req.body;
    const medicalHistory = req.file.filename || "";

    if (!patientId) {
      return res.json({
        success: false,
        message: "Invalid User"
      })
    }

    let result;
    try {
      [result] = await conn.query('insert into patient_details (patient_id,blood_group,medical_history) values (?)',[[patientId,bloodgroup,medicalHistory]])
    } catch (error) {
      return res.json({
        success: false,
        message: "Internal Server Error"
      })
    }

    return res.json({
      success: true,
      message: "data inserted successfully"
    })

  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

exports.patientDetails = async (req, res) => {
  try {
    const { id } = req.body;

    let [result] = await conn.query('select * from patient_details where patient_id=?', [id]);

    if (result.length > 0) {
      return res.json({
        success: false,
        message: "patient present"
      })
    }

    return res.json({
      success: true,
      message: "patient details empty"
    })
  } catch (error) {

  }
}

exports.patientViewProfile = async (req, res) => {
  res.render('pages/patientPanel/patientProfileView')
}

exports.patientViewProfileData = async (req, res) => {
  try {
    const patient_id = req.user.id
    let [result] = await conn.query('select fname as "First name", lname as "Last name", email as Email,dob as "Date of Birth", gender as Gender, phone as Contact,  address as Address, city as City from users where users.id = ? and role_id = ?;', [patient_id, 1])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}

exports.getpatientProfileUpdate = async (req, res) => {
  res.render('pages/patientPanel/patientProfileUpdate')
}

exports.patientProfileUpdateData = async (req, res) => {
  try {
    const patient_id = req.user.id
    let [result] = await conn.query(`select fname,lname,dob,gender,phone,address,city,profile_picture from users inner join profile_pictures on profile_pictures.user_id = users.id where role_id=? and users.id = ? and profile_pictures.is_active = ?`, [1, patient_id, 1])
    res.json(result)
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}

exports.postPatientProfileUpdate = async (req, res) => {
  try {
    const patient_id = req.user.id
    const { fname, lname, dob, phone, address, city, gender } = req.body
    const profile_picture = req.file?.filename || ""


    if (!fname || !lname || !dob || !phone || !address || !city) {
      return res.status(402).json({
        success: false,
        message: "fill the fields"
      })
    }

    if (!patient_id) {
      return res.status(500).json({
        success: false,
        message: "Internal server Error",
      });
    }

    try {
      await conn.query(`update users set fname = ?,lname = ?, dob = ?, phone = ?, address = ?, city = ?, gender =? where users.id = ? and role_id = ?`, [fname, lname, dob, phone, address, city,gender, patient_id, 1])

    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      })
    }

    if (!profile_picture == "") {
      try {
        await conn.query(`update profile_pictures set is_active = ? where user_id = ?`, [0, patient_id])
      }
      catch (error) {
        return res.json({
          success: false,
          message: error.message
        })
      }

      try {
        await conn.query(
          `insert into profile_pictures (profile_picture,user_id) values (?,?)`, [profile_picture, patient_id]
        )
      } catch (error) {
        return res.json({
          success: false,
          message: error.message
        })
      }
    }
    return res.status(200).json({success:true,message:"Updated Successfully"})

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}