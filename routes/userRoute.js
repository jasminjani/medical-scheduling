const express = require('express');
const { allUser } = require('../controllers/userController');
const router = express.Router();


router.route("/user")
.get(allUser)


module.exports = router;