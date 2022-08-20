const mysql = require("mysql");

module.exports = {
  getUsersByDB: () => new Promise((resolve, reject) => {
    // Mysql Connection
    const mysqlConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      database: process.env.DB_NAME
    });
    mysqlConnection.connect();

    // Test Query
    mysqlConnection.query('select * from user', (error, result, _field) => {
      if (result) {
        resolve(result);
      }
      
      if (error) {
        console.log("db-error:", error);
        reject("Mysql Error");
      }
    });

    // Mysql Disconnected
    mysqlConnection.end();
  }),
  getUserPaylod: (snsId) => {
    // 회원번호로 user table을 조회해서 해당하는 row가 있는지 확인
    // 해당하는 row가 있으면 사용자 정보를 가져온다.
    // // mysql find

    // // 4. 유저가 존재하지 않는다면, 새로운 유저 생성
    // if (!isExist) {
    //   createNewUser(snsId);
    // }
    return { userId: snsId, nickname: "test", profile: null, isNew: true };
  },
};
