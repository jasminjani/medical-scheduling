const conn = require("../config/dbConnection")

exports.getSpecialties = async (req, res) => {

  try {
    const [result] = await conn.query('select id,speciality from specialities');
    res.json(result);
  } catch (error) {
    return res.send("DB error")
  }
}

exports.deleteSpecialty = async (req, res) => {
  // console.log(req.body.id);
  try {
    await conn.query('delete from specialities where id =?', [req.body.id]);
  } catch (error) {
    console.log(error);
  }
}

exports.addSpecialty = async (req, res) => {

  console.log(req.body);
  try {

  } catch (error) {

  }
}