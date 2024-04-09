const conn = require("../config/dbConnection");

exports.paymentsController = async (req, res) => {

  try {

    let { patient_id, doctor_id, slot_id, payment_amount, status } = req.body;


    let sql = `insert into payments(patient_id,doctor_id,slot_id,payment_amount,status) values(?,?,?,?,?)`;
    let arr = [patient_id, doctor_id, slot_id, payment_amount, status]


    let [results] = await conn.query(sql, arr);

    res.json({
      msg: 'payments Done'
    })

  } catch (error) {
    res.send("server error");
    console.log(error);
  }

}
