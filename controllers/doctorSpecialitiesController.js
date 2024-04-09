const conn = require('../config/dbConnection.js')

exports.createSpecialities = async (req, res) => {
  try {
    const { speciality } = req.body
    await conn.query(`insert into specialities (speciality) values (?)`, [speciality])
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.allSpecialities = async (req, res) => {
  try {
    [result] = await conn.query(`select * from specialities`)
    res.send(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}