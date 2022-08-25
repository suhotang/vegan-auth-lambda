const mysql = require("mysql2/promise");

module.exports = {
  getUserPaylod: async (snsId) => {
    try {
      if (snsId) {
        throw "유효하지 않은 snsId";
      }

      // Mysql Connection
      const mysqlConnection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWD,
        database: process.env.DB_NAME,
      });

      let isNew = false;
      let userId = null;
      const [users, fields] = await mysqlConnection.query(
        `select * from user where sns_id='${snsId}'`
      );
      //console.log(users);

      if (Array.isArray(users) && users.length > 0) {
        console.log("이미 존재하는 사용자");
        userId = users[0]?.id;
      } else {
        console.log("존재하지 않는 사용자");
        isNew = true;
      }

      if (isNew) {
        console.log("회원가입!");
        const userInsertSql = `INSERT INTO user (sns_id) VALUES ('${snsId}')`;
        const [results] = await mysqlConnection.query(userInsertSql);
        userId = results?.insertId;
      }

      // Mysql Disconnected
      mysqlConnection.end();

      return { userId, isNew };
    } catch (e) {
      throw e;
    }
  },
};
