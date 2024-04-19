const fs = require('fs');

exports.allRequestLogs = (req, res, next) => {
  try {
    let fullURL = `${req.ip.split(':').pop()} ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} \n`;

    let fileName = 'uploads/requestLogs/requestURL.log';
    fs.appendFileSync(fileName, fullURL, (err) => {
      if (err) {
        console.log("Error in write URL");
      }
    });
  } catch (error) {
    console.log("some error in request.log middleware");
  }

  next()
}