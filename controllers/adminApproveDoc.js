const conn = require("../config/dbConnection");

exports.pendingDoctos = async (req, res) => {

  try {

    let sql = `select a.id,concat(a.fname,' ',a.lname) as doctor_name,a.email,b.qualification from users a
    inner join doctor_details b on a.id = b.doctor_id where b.status = 0`
    const [result] = await conn.query(sql)

    res.json(result);

  } catch (error) {
    console.log(error);
  }
}


exports.individualDoctor = async (req, res) => {

  try {

    const docID = req.params.id;

    let sql = `select a.fname,a.lname,a.email,a.phone,a.gender,a.dob,b.qualification,a.address,
    c.name,c.location,c.city,c.gst_no from users a 
    inner join doctor_details b on a.id = b.doctor_id 
    inner join clinic_hospitals c on b.hospital_id = c.id
    where b.status = 0 and a.id = ?`

    let [result] = await conn.query(sql, [docID]);
    // console.log(result);

    if (result.length === 0) {
      res.send("not valid doctor")
    }
    else {
      res.render('pages/adminPanel/approveDoctor.ejs', { data: result[0], docID });
    }
  } catch (error) {
    console.log(error);
  }

}

exports.approveDoctor = async (req, res) => {
  try {
    const docID = req.params.id;
    // console.log(typeof docID);

    let sql1 = `update doctor_details set status=1 where doctor_id =? and status=0`
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

    let sql1 = `update doctor_details set status=-1 where doctor_id =? and status=0`

    await conn.query(sql1, [docID]);

    res.status(200).send()

  } catch (error) {
    console.log(error);
  }
}