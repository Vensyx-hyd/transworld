var db = require('../db/db.js')

class LoginService{
  constructor(){

  };

  async login (query) {
    const {id}=query;
    const { rows } = await db.query('SELECT * FROM user WHERE id = $1', [id])
    return rows[0];
  }

  async forgotPassword (){
    const { rows } = await db.query('SELECT * FROM users ')
    console.log(rows)
    return rows;
  }

  async resetPassword(inputId,input) {
    const id = parseInt(inputId)
    const { name, email } = input

    await db.query(
      'UPDATE user SET user_pwd = $1 WHERE id = $3',
      [name, email, id])
    return `Driver modified with ID: ${id}`;
  }
}

module.exports = LoginService;


