const conn = require('../../config/dbConnection')

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