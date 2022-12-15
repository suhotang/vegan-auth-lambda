const { getMysqlConnection } = require("../util/mysqlUtil");

module.exports = {
  getUserPaylod: async (snsId) => {
    if (!snsId) {
      throw "유효하지 않은 snsId";
    }

    const mysqlConnection = await getMysqlConnection();

    let isNew = false;
    let userId = null;
    const [users, _fields] = await mysqlConnection.query(
      `select * from user where sns_id='${snsId}'`
    );

    if (Array.isArray(users) && users.length > 0) {
      //console.log("이미 존재하는 사용자");
      userId = users[0]?.id;
    } else {
      //console.log("존재하지 않는 사용자");
      isNew = true;
    }

    if (isNew) {
      //console.log("회원가입!");
      const userInsertSql = `INSERT INTO user (sns_id) VALUES ('${snsId}')`;
      const [results] = await mysqlConnection.query(userInsertSql);
      userId = results?.insertId;
    }

    mysqlConnection.end();

    return { userId, isNew };
  },
  getAdminUserById: async (id) => {
    const mysqlConnection = await getMysqlConnection();

    const [users, _fields] = await mysqlConnection.query(
      `select * from admin_info where password_identifier='${id}'`
    );

    mysqlConnection.end();

    if (users.length < 1) {
      throw {
        statusCode: 400,
        //message: `올바르지 않은 id: ${id}`
      };
    }

    return users[0];
  },
};
