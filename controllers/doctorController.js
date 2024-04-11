const conn = require('../config/dbConnection.js')

exports.allDoctor = async (req, res) => {

  try {
    [result] = await conn.query(`select fname, lname, email, gender, phone, profile, name, location, gst_no, city, pincode,speciality from doctor_details inner join users on doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id inner join clinic_hospitals on  doctor_details.hospital_id = clinic_hospitals.id
     where users.role_id = 2`)
    res.send(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.createDoctor = async (req, res) => {
  try {
    const { doctor_id, speciality_id, name, location, gst_no, city, pincode, qualification, consultancy_fees } = req.body
    let hospital_id
    console.log(req.body);

    // validte hospital_detail
    if (!name || !location || !gst_no || !city || !pincode) {
      return res.status(500).json({
        success: false,
        message: "Please fill details"
      })
    }

    // validate doctor_details
    if (!doctor_id || !hospital_id || !qualification || !consultancy_fees) {
      return res.status(500).json({
        success: false,
        message: "Please fill Details"
      })
    }

    // validate doctor_has_speciality
    if (!doctor_id || !speciality_id) {
      return res.status(500).json({
        success: false,
        message: "Please fill Details"
      })
    }


    // doctor_id  last insreted user id
    // speciality_id dropdown selection speciality_table
    try {
      const [result] = await conn.query(`insert into clinic_hospitals (name,location,gst_no,city,pincode) values (?,?,?,?,?)`, [name, location, gst_no, city, pincode])
      hospital_id = result.insertId;

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }

    try {
      await conn.query(`insert into doctor_details (doctor_id,hospital_id,qualification,consultancy_fees) values (?,?,?,?)`, [doctor_id, hospital_id, qualification, consultancy_fees])

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }

    try {
      await conn.query(`insert into doctor_has_specialities (doctor_id,speciality_id) values (?,?)`, [doctor_id, speciality_id])
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



exports.doctorDisplay = async (req, res) => {

  try {
    const doctor_id = req.params.id
    const [result] = await conn.query(`select doctor_details.id,clinic_hospitals.id as hospital_id, fname,lname,email,gender,dob,phone,address,profile,name,location,gst_no,city,pincode,speciality, qualification, consultancy_fees from doctor_details inner join users on  doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join clinic_hospitals on clinic_hospitals.id = doctor_details.hospital_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id where doctor_details.doctor_id = ?;`, [doctor_id])
    res.send(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.updateDoctorDetails = async (req, res) => {

  let doctor_id = req.params.id
  const { name, location, gst_no, city, pincode, qualification, consultancy_fees, id, hospital_id } = req.body;
  // console.log(req.body);

  // validate
  if (!id) {
    return res.status(500).json({
      success: false,
      message: "Internal server Error"
    })
  }

  if (!hospital_id) {
    return res.status(500).json({
      success: false,
      message: "Internal server Error"
    })
  }

  try {
    let [result] = await conn.query(`update clinic_hospitals set name = ?, location = ?, gst_no =?,city = ?,pincode =? where clinic_hospitals.id = ?`, [name, location, gst_no, city, pincode, hospital_id, doctor_id])
    console.log(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
  try {
    let [result] = await conn.query(`update doctor_details set qualification = ?,consultancy_fees= ? where doctor_details.id = ? and doctor_id = ?`, [qualification, consultancy_fees, id, doctor_id])
    return res.json({
      result,
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

}

exports.getDoctorReview = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    const query = `select doctor_details.hospital_id, doctor_details.qualification, doctor_details.consultancy_fees, rating_and_reviews.patient_id, rating_and_reviews.rating, rating_and_reviews.review from doctor_details inner join rating_and_reviews on doctor_details.doctor_id = rating_and_reviews.doctor_id where doctor_details.doctor_id = ?`;

    let [data] = await conn.query(query, [doctor_id]);

    log
  }
  catch {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}