const { getMysqlConnection } = require("../util/mysqlUtil");

module.exports = {
  getUserPaylod: async (snsId) => {
    if (!snsId) {
      throw "유효하지 않은 snsId";
    }

    const mysqlConnection = await getMysqlConnection();

    const [users, _fields] = await mysqlConnection.query(
      `select * from user where sns_id='${snsId}'`
    );

    mysqlConnection.end();

    if (Array.isArray(users) && users.length > 0) {
      return userId;
    } else {
      return false;
    }
  },
  createNewUser: async () => {
    const mysqlConnection = await getMysqlConnection();

    const userInsertSql = `INSERT INTO user (sns_id) VALUES ('${snsId}')`;
    const [userResults] = await mysqlConnection.query(userInsertSql);
    const userId = userResults?.insertId;

    mysqlConnection.end();

    return userId;
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
