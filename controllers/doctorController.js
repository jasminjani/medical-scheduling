const conn = require('../config/dbConnection.js')


exports.doctorDashBoard = (req, res)=> {
  res.render('pages/doctorPanel/dashboard')
}

exports.getDoctorSideBarDetail = async (req,res) => {
    try {
      const id = req.params.id
      const [result] = await conn.query(`select concat(fname, " ",lname) as name,email from users where role_id = ? and users.id = ?`,[2,id])
      res.json(result)
      
    } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.message
      })
    }
}



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
    const { doctor_id, speciality, name, location, gst_no, city, pincode, qualification, consultancy_fees } = req.body
    let hospital_id
    // console.log(req.body);

    // validte hospital_detail
    if (!name || !location || !gst_no || !city || !pincode) {
      return res.status(500).json({
        success: false,
        message: "Please fill Hospital details "
      })
    }

    // validate doctor_details
    if (!doctor_id ||  !qualification || !consultancy_fees) {
      return res.status(500).json({
        success: false,
        message: "Please fill Doctor Details"
      })
    }

    // validate doctor_has_speciality
    if (!doctor_id || !speciality) {
      return res.status(500).json({
        success: false,
        message: "Please fill Speciality Details"
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
      await conn.query(`insert into doctor_has_specialities (doctor_id,speciality_id) values (?,?)`, [doctor_id, speciality])
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
    res.status(200).json({
      success:true,
      message:"inserted Successfully"
    })
  }

  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


exports.updateDoctorDetails = async (req, res) => {

  let doctor_id = req.params.id
  const { fname, lname, dob, gender, phone, address, name, location, gst_no, city, pincode, qualification, consultancy_fees, id, hospital_id, speciality } = req.body;
  console.log(req.body);

  // validate
  if (!id) {
    return res.status(500).json({
      success: false,
      message: "Internal server Error"
    })
  }

  try {
     try{
     await conn.query(`update users set fname = ?,lname = ?,dob=?,gender=?,phone = ?,address = ? where users.id = ? and role_id = ?`, [fname, lname, dob,gender, phone, address,doctor_id,2])
     }
  catch(error){
    console.log(error);
    return res.json({
      success:false,
      message:error.message
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
   
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
  try {

  await conn.query(`update doctor_details set qualification = ?,consultancy_fees= ? where doctor_details.id = ? and doctor_id = ?`, [qualification, consultancy_fees, id, doctor_id])
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

  try {

    await conn.query(`update doctor_has_specialities set speciality_id = ? where  doctor_id =?`,[speciality,doctor_id])
    
    
  } catch (error) {
    console.log(error);
    return res.json({

      success: false,
      message: error.message
    })
  }

   res.json({success:true,message:"Update Successfully"})
  } catch (error) {
    return res.json({
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

    console.log(data);

    return res.status(200).json ({
      success: true,
      message: "Doctor reviews displayed!!"
    });
  }
  catch {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



// render controller date: 12-04-2024

exports.doctorDisplay = async (req, res) => {
  await res.render('pages/doctorPanel/profile')
}

exports.updateGetDoctorDisplay = async(req,res)=>{
    await res.render('pages/doctorPanel/editprofile')
} 





// json controller

exports.doctorData = async (req, res) => {

  try {
    const doctor_id = req.params.id

    const [result] = await conn.query(`select doctor_details.id,clinic_hospitals.id as hospital_id, fname,lname,email,gender,dob,phone,address,name,location,gst_no,city,pincode,speciality , qualification, consultancy_fees from doctor_details inner join users on  doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join clinic_hospitals on clinic_hospitals.id = doctor_details.hospital_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id where doctor_details.doctor_id = ?;`, [doctor_id])
    res.json(result)
      } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.becomeDoctorDetail = async (req,res)=>{
  res.render('pages/doctorPanel/doctorDetails')
}


exports.updateGetDoctorData = async (req, res) => {

  try {
    const doctor_id =  req.params.id

    const [result] = await conn.query(`select specialities.id as speciality,doctor_details.id, doctor_details.doctor_id,clinic_hospitals.id as hospital_id, fname,lname,email,gender,dob,phone,address,name,location,gst_no,city,pincode, qualification, consultancy_fees from doctor_details inner join users on  doctor_details.doctor_id = users.id inner join doctor_has_specialities on doctor_details.doctor_id = doctor_has_specialities.doctor_id inner join clinic_hospitals on clinic_hospitals.id = doctor_details.hospital_id inner join specialities on specialities.id = doctor_has_specialities.speciality_id where doctor_details.doctor_id = ?;`, [doctor_id])
     res.json(result)

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



