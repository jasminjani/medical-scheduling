const conn = require('../../config/dbConnection')

exports.doctorDisplay = async (req, res) => {
  await res.render("pages/doctorPanel/doctorprofile");
};

exports.updateGetDoctorDisplay = async (req, res) => {
  await res.render('pages/doctorPanel/editprofile')
}

exports.getDoctorReview = async (req, res) => {
  await res.render('pages/doctorPanel/viewfeedback')
}

exports.getPatientDetail = async (req, res) => {
  req.params.id
  await res.render('pages/doctorPanel/patienthistory')
}

exports.getPatientHistoryDetail = async (req, res) => {
  req.params.patient_id
  await res.render('pages/doctorPanel/patientDetail')
}

exports.becomeDoctorDetail = async (req, res) => {
  res.render("pages/doctorPanel/doctorDetails");
};

exports.logoutController = async (req, res) => {
  res.clearCookie('token')
  res.status(200).redirect('/login')
}