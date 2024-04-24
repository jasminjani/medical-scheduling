const conn = require('../../config/dbConnection')

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

exports.updateDoctorDetails = async (req, res) => {
  //doctor_id get token
  console.log(req.body);
  let doctor_id = req.user.id
  const { fname, lname, dob, gender, phone, address, name, location, gst_no, city, pincode, qualification, consultancy_fees, id, hospital_id, speciality } = req.body;
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
    
    return res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    return res.json({
     
      success: false,
      message: error.message,
    });
  }
};