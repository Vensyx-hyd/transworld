
var mysql = require('promise-mysql');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'vensyxappdb.mysql.database.azure.com',
  user            : 'tg_app',
  password        : 'Tgapp@1234',
  database        : 'tg_app',
  port            : 3306,
  ssl             : true
});

module.exports = {
   query: async (text, params) =>  await pool.query(text, params).then(function (rows) {
    return rows;
  }).error(function(error){
    console.log(error)
    return error;
  })
}