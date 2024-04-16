const conn = require("../config/dbConnection")

exports.getSpecialties = async (req, res) => {

  try {
    const [result] = await conn.query('select id,speciality from specialities where status = 1');
    res.json(result);
  } catch (error) {
    console.log(error);
  }
}

exports.deleteSpecialty = async (req, res) => {
  // console.log(req.body.id);
  try {
    await conn.query('update specialities set status = 0 where id = ?', [req.body.id]);
    res.status(200).send();
  } catch (error) {
    console.log(error);
  }
}

exports.getNewSpecialties = async (req, res) => {

  try {
    const [result] = await conn.query('select id,speciality from specialities where status = 0');
    res.json(result);

  } catch (error) {
    console.log(error);
  }
}

exports.addNewSpecialties = async (req, res) => {

  try {
    await conn.query('update specialities set status = 1 where id = ?', [req.body.id]);
    res.status(200).send();

  } catch (error) {
    console.log(error);
  }

}