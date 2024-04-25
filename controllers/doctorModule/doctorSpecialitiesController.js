const conn = require('../../config/dbConnection')

// json controller
exports.allSpecialities = async (req, res) => {
  try {
    [result] = await conn.query(`select id as speciality_id,speciality from specialities where approved = 1`)
    res.json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}