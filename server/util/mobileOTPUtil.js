'use strict';
//var rp = require('request-promise');

exports.sendOTP = async function(phone) {

    const otp = Math.round(Math.random() * 1000000);
    const message = `Otp for your mobile login is : ${otp}. Please do not share this with anyone`;
    var options = {
        method: 'POST',
        uri: 'http://api.msg91.com/api/sendhttp.php',
        body: {
            authkey:'268309AxaGdQSE5c90973d',
            country:'91',
            mobiles:phone,
            message:encodeURIComponent(message),
            sender:'920322',
            response:'json',
            route: 4
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options)
        .then(function (parsedBody) {
            console.log("send OTP inside");
            console.log(parsedBody);
            console.log("send OTP inside");
        })
        .catch(function (err) {
            console.log(err);
        });
};