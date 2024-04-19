const fs = require('fs');

exports.allRequestLogs = (req, res, next) => {
  let fullURL = `${req.ip.split(':').pop()} ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} \n`;

  let fileName = 'uploads/requestLogs/requestURL.log';
  fs.appendFileSync(fileName, fullURL, (err) => {
    if (err) {
      console.log("In File not write URL");
    } else {
      console.log("URL write in Demo file");
    }
  });


  next()
}