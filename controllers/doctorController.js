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
        // doctor_id  last insreted user id
        // speciality_id dropdown selection speciality_table
        const { doctor_id, speciality_id, name, location, gst_no, city, pincode, qualification, consultancy_fees } = req.body
        let hospital_id
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
    const [result] = await conn.query(`select doctor_details.id,fname,lname,email,gender,dob,phone,address,profile,name,location,gst_no,city,pincode,speciality, qualification, consultancy_fees from doctor_details inner join users on  doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join clinic_hospitals on clinic_hospitals.id = doctor_details.hospital_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id where doctor_details.doctor_id = ?;`, [doctor_id])
    res.send(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.updateDoctorDetails = async (req, res) => {

  
    try {
      let doctor_id = req.params.id
      const { qualification, consultancy_fees, id } = req.body;
    let [result]=  await conn.query(`update doctor_details set qualification = ?,consultancy_fees= ? where doctor_details.id = ? and doctor_id = ?`, [ qualification, consultancy_fees, id, doctor_id])
      return res.json({
        result,
        success:true
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
}



// exports.speciality = async (req,res)=>{

// }
