const conn = require("../../config/dbConnection");

exports.profilePhoto = (req, res) => {

  // let user = req.user;
  let { id, fname, lname, email, } = req.user;
  // console.log(user);

  res.json({ id: id, name: `${fname} ${lname}`, email: email });
}