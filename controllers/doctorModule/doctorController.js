
exports.doctorDashBoard = (req, res) => {
  res.render("pages/doctorPanel/doctorDashboard");
};

exports.doctorDisplay = async (req, res) => {
  await res.render("pages/doctorPanel/doctorViewProfile");
};

exports.updateGetDoctorDisplay = async (req, res) => {
  await res.render('pages/doctorPanel/doctorProfileUpdate')
}

exports.getDoctorReview = async (req, res) => {
  await res.render('pages/doctorPanel/doctorReview')
}

exports.getPatientDetail = async (req, res) => {
  req.params.id
  await res.render('pages/doctorPanel/doctorPatientHistory')
}

exports.getPatientHistoryDetail = async (req, res) => {
  req.params.patient_id
  await res.render('pages/doctorPanel/doctorPatientDetails')
}

exports.becomeDoctorDetail = async (req, res) => {
  res.render("pages/doctorPanel/becomeDoctorDetails");
};

exports.logoutController = async (req, res) => {
  res.clearCookie('token')
  res.status(200).redirect('/login')
}