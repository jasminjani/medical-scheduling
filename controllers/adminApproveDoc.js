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

    const doc_id = req.params.id;

    let sql = `select a.fname,a.lname,a.email,a.phone,a.gender,a.dob,a.address,
    c.name,c.location,c.city,c.gst_no from users a 
    inner join doctor_details b on a.id = b.doctor_id 
    inner join clinic_hospitals c on b.hospital_id = c.id
    where b.status = 0 and a.id = ?`

    let [result] = await conn.query(sql, [doc_id]);
    // console.log(result);
    res.render('pages/adminPanel/approveDoctor.ejs', { result });

  } catch (error) {
    console.log(error);
  }
}