const conn = require('../config/dbConnection.js')

exports.createSpecialities = async (req, res) => {
  const { speciality } = req.body

  if(!speciality)
  {
    return res.status(500).json({
      success: false,
      message: "Please Fill Field"
    })
  }
  try {
    await conn.query(`insert into specialities (speciality) values (?)`, [speciality])
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}




// json controller
exports.allSpecialities = async (req, res) => {
  try {
    [result] = await conn.query(`select speciality from specialities`)
    res.json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}