'use strict';


const crypto = require('crypto');

const ENCRYPTION_KEY = crypto.createHash('sha256').update(String("ENC_KEY_FOR_CFS_MUNDRA_PORT_APPS")).digest('base64').substr(0, 32); // Must be 32 characters for aes-256-cbc
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Generate encrypted password for "Test123"
// const encryptedPassword = encrypt("Test123");
// console.log("Encrypted Password:", encryptedPassword);

module.exports = { decrypt, encrypt };















// const crypto = require('crypto');

// const ENCRYPTION_KEY = "ENC_KEY_FOR_CFS_MUNDRA_PORT_APPS";//process.env.ENCRYPTION_KEY; // Must be 256 bytes (32 characters)
// const IV_LENGTH = 16; // For AES, this is always 16

// function encrypt(text) {
//   let iv = crypto.randomBytes(IV_LENGTH);
//   let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer.alloc(ENCRYPTION_KEY), iv);
//   let encrypted = cipher.update(text);

//   encrypted = Buffer.concat([encrypted, cipher.final()]);

//   return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// function decrypt(text) {
//   let textParts = text.split(':');
//   let iv = new Buffer.alloc(textParts.shift(), 'hex');
//   let encryptedText = new Buffer.alloc(textParts.join(':'), 'hex');
//   let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer.alloc(ENCRYPTION_KEY), iv);
//   let decrypted = decipher.update(encryptedText);

//   decrypted = Buffer.concat([decrypted, decipher.final()]);

//   return decrypted.toString();
// }
// let text = encrypt("test1234");
// console.log(text);
// // console.log(decrypt(text));


// module.exports = { decrypt, encrypt };
