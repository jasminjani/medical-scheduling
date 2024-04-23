const conn = require("../../config/dbConnection");


exports.getAllDoctors = async (req, res) => {

  try {
    const sql = `select *,a.doctor_id from doctor_details where approved = 1`;
    const sql2 = `select * from users a 
    inner join doctor_details b on a.id = b.doctor_id 
    inner join clinic_hospitals c on b.hospital_id = c.id  order by a.id`;

    const [result] = await conn.query(sql2);

    res.json(result);
  } catch (error) {
    console.log(error);
  }
}

exports.deleteDoctor = async (req, res) => {

  const docID = req.params.id;
  console.log(docID);

  const sql = `update doctor_details set approved = -1 where doctor_id =?`
  let [result] = await conn.query(sql, [docID]);

  res.status(200).send();
}



exports.individualDoctor = async (req, res) => {

  try {

    const docID = req.params.id;

    let sql = `select a.fname,a.lname,a.email,a.phone,a.gender,a.dob,b.qualification,a.address,
    c.name,c.location,c.city,c.gst_no from users a 
    inner join doctor_details b on a.id = b.doctor_id 
    inner join clinic_hospitals c on b.hospital_id = c.id
    where b.approved in (-1,0) and a.id = ?`

    let [result] = await conn.query(sql, [docID]);
    // console.log(result);

    if (result.length === 0) {
      res.send("not valid doctor")
    }
    else {
      res.json({result});
    }
  } catch (error) {
    console.log(error);
  }

}


exports.individualDoctorRend=async(req,res)=>{
  try{

    const docID=req.params.id;
    res.render('pages/adminPanel/adminApproveSpecificDoctor.ejs', {docID})

  }catch (error) {
    console.log(error);
  }
}

exports.showDoctorDetail = async (req, res) => {

  try {

    const docID = req.params.id;

    let sql = `select a.fname,a.lname,a.email,a.phone,a.gender,a.dob,b.qualification,a.address,
    c.name,c.location,c.city,c.gst_no from users a 
    inner join doctor_details b on a.id = b.doctor_id 
    inner join clinic_hospitals c on b.hospital_id = c.id
    where b.approved = 1 and a.id = ?`

    let [result] = await conn.query(sql, [docID]);
    // console.log(result);

    if (result.length === 0) {
      res.send("not valid doctor")
    }
    else {
      res.json({result});

    }
  } catch (error) {
    console.log(error);
  }

}


exports.showDoctorDetailRend = async (req, res) => {

  try {
    const docID = req.params.id;
    res.render('pages/adminPanel/adminShowOneDoc.ejs', { docID });

  } catch (error) {
    console.log(error);
  }

}



exports.approveDoctor = async (req, res) => {
  try {
    const docID = req.params.id;
    // console.log(typeof docID);

    let sql1 = `update doctor_details set approved=1 where doctor_id =? and approved in (-1,0)`
    let sql2 = `update users set role_id = 2 where id = ? and role_id =1`

    await conn.query(sql1, [docID]);
    await conn.query(sql2, [docID]);

    res.status(200).send()

  } catch (error) {
    console.log(error);
  }
}

exports.rejectDoctor = async (req, res) => {
  try {
    const docID = req.params.id;
    // console.log(typeof docID);

    let sql1 = `update doctor_details set approved=-1 where doctor_id =? and approved=0`

    await conn.query(sql1, [docID]);

    res.status(200).send()

  } catch (error) {
    console.log(error);
  }
}