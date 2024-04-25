const conn = require('../../config/dbConnection')

exports.getCityCombo = async (req, res) => {
  try {
    const [result] = await conn.query(`select * from cities order by city`);
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};