const conn = require('../../config/dbConnection')

exports.getDoctorSideBarDetail = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const [result] = await conn.query(
      `select concat(fname, " ",lname) as name,profile_picture,email from users inner join profile_pictures on users.id = profile_pictures.user_id where role_id = ? and users.id = ? and profile_pictures.is_active = ?;`,
      [2, doctor_id,1]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



