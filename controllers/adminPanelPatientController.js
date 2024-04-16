const conn = require("../config/dbConnection");

exports.displayAllPatient = async (req, res) => {
  try {

    const sql = `SELECT id, fname, lname, email FROM users WHERE role_id = 1`;
    const [allPatient] = await conn.query(sql);
    res.render('pages/adminPanel/allPatientDetail', { allPatient: allPatient })

  } catch (error) {
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

    const sql = `SELECT id, fname, lname, email FROM users WHERE role_id = 1 AND (fname LIKE '${req.params.searchedName}%' OR lname LIKE '${req.params.searchedName}%')`;
    const [searchedPatient] = await conn.query(sql);
    res.send({ allPatient: searchedPatient })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
