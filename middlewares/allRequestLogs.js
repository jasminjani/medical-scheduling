const fs = require('fs');

exports.allRequestLogs = (req, res, next) => {
  try {

    let time = new Date().toLocaleString();

    // let fullURL = `${req.ip.split(':').pop()} ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} \n`;
    let fullURL = `${time} ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} \n`;

    let fileName = 'uploads/requestLogs/requestURL.log';

    fs.appendFileSync(fileName, fullURL, (err) => {
      if (err) {
        console.log("Error in write URL");
      }
    });
  } catch (error) {
    console.log("some error in allRequestLogs.js middleware so create folder  : uploads/requestLogs");
  }

  next()
}