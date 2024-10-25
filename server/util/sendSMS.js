'use strict';
const http = require("http");

const options = {
  "method": "POST",
  "hostname": "api.msg91.com",
  "port": null,
  // "path": "/api/v2/sendsms?country=91&sender=VM-CFSIND", 
  "path": "/api/v2/sendsms?country=91&sender=TGMODE", 
  "headers": {
    "authkey": "268309AxaGdQSE5c90973d",
    "content-type": "application/json"
  }
};

function sendSMS (message, to) {
  var req = http.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  
  req.write(JSON.stringify({ sender: 'SOCKET',
    route: '4',
    country: '91',
    sms: 
     [ { message: message, to: to } ] 
    }));
  req.end();
}

module.exports = {
  sendSMS
}