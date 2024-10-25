'user strict';
require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'vensyxappdb.mysql.database.azure.com';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'tg_app';
CONFIG.db_user      = process.env.DB_USER       || 'tg_app';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'Tgapp@1234';

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'MakResRep0013hijkl';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

module.exports = CONFIG;