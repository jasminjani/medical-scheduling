
exports.adminDashboard = (req, res) => {

  res.render('pages/adminPanel/adminDashboard')
}

exports.adminDeleteDoctors = (req, res) => {

  res.render('pages/adminPanel/adminApproveDoc')
}

exports.adminApproveDoctors = (req, res) => {

  res.render('pages/adminPanel/adminApproveDoc')
}

exports.adminGetAllPatients = (req, res) => {

  res.render('pages/adminPanel/adminShowPatient')
}


exports.adminAddSpecialites = (req, res) => {
  res.render("pages/adminPanel/addDocSpecialty");
};
