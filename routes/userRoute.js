const express = require("express");
const { allUser } = require("../controllers/userController");
const router = express.Router();
const { imgStorage, fileStorage } = require("../utils/multer");
const multer = require("multer");
const imgUpload = multer({ storage: imgStorage });
const fileUpload = multer({ storage: fileStorage });

router.route("/user")
.get(allUser);

module.exports = router;
