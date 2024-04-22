const conn = require('../../config/dbConnection')

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