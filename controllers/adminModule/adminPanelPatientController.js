const conn = require("../../config/dbConnection");

exports.displayAllPatient = async (req, res) => {
  try {

    res.render('pages/adminPanel/allPatientDetail')

  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.getAllPatients = async (req, res) => {

  try {
    const sql = `SELECT id, fname, lname, email FROM users WHERE role_id = 1 AND is_deleted = 0`;
    const [allPatient] = await conn.query(sql);

    res.json(allPatient);

  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.searchPatientByName = async (req, res) => {
  try {

    const { searchedName } = req.params;

    if (!searchedName) {
      return res.status(500).json({
        success: false,
        message: "Please serch name"
      })
    }

    const sql = `SELECT id, fname, lname, email FROM users WHERE role_id = 1 AND is_deleted = 0 AND (fname LIKE '${searchedName}%' OR lname LIKE '${searchedName}%')`;
    const [searchedPatient] = await conn.query(sql);
    res.send({ allPatient: searchedPatient })

  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
