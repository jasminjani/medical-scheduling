const express = require("express");
const passport = require("passport");
const multer = require("multer");
const { imgStorage } = require("../utils/multer");

const imgUpload = multer({ storage: imgStorage });
const router = express.Router();

const {
  homePage,
  getDoctorDetails,
  getCreateUserForm,
  createUser,
  getLoginForm,
  login,
  getCurrentUser,
  logout,
  getUserById,
  deleteUser,
  generateToken,
  activationForm,
  activationAccount,
  forgotPassword,
  forgotPassLink,
  createPasswordForm,
  updatePassword,
  contactUsHomePage,
} = require("../controllers/authController");

router.route("/").get(homePage);
router.route('/contact-message').post(contactUsHomePage)
router.route("/alldoctors").get(getDoctorDetails);

router
  .route("/register")
  .get(getCreateUserForm)
  .post(imgUpload.single("profile"), createUser);

router.route("/login").get(getLoginForm).post(login);

router
  .route("/current-user")
  .get(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    getCurrentUser
  );

router
  .route("/logout")
  .post(
    passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
    logout
  );

router.route("/user/:id").post(getUserById);

router.route("/user/:id").delete(deleteUser);

router.route("/generatetoken").post(generateToken);

router.route("/account-activation").get(activationForm);

router.route("/activate").get(activationAccount);

router.route("/forgot-password").get(forgotPassword).post(forgotPassLink);

router.route("/forgot").get(createPasswordForm);

router.route("/forgot/change-password").post(updatePassword);

module.exports = router;
