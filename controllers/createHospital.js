const conn = require("../config/dbConnection");

// FOR CREATING NEW HOSPITAL - DOCTOR WILL ENTER AND ADMIN WILL VERIFY
exports.createHospital = async (req, res) => {
  try {
    let { name, location, gstNo, city, pincode } = req.body;

    if (!name || !location || !gstNo || !city || !pincode) {
      return res.status(500).json({
        success: false,
        message: "Please fill all fields"
      })
    }

    const sql = `INSERT INTO clinic_hospitals (name, location, gst_no, city, pincode) VALUES (?, ?, ?, ?, ?)`;
    const [createHospital] = await conn.query(sql, [name, location, gstNo, city, pincode]);
    res.send(createHospital)

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

