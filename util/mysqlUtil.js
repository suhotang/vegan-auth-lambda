const mysql = require("mysql2/promise");

module.exports = {
  getMysqlConnection: async () => {
    // Mysql Connection
    const mysqlConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      database: process.env.DB_NAME,
    });

    return mysqlConnection;
  },
};
