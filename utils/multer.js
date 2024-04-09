const multer = require("multer");

// multer configuration
exports.imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/imgs/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname );
  },
});


exports.fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/files/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname );
  },
});

