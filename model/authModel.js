const { getMysqlConnection } = require("../util/mysqlUtil");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

module.exports = {
  saveRefreshToken: async (userId, refreshToken) => {
    if (!refreshToken) {
      throw "유효하지 않은 refreshToken";
    }

    const mysqlConnection = await getMysqlConnection();
    const uuid = uuidv4();

    // TODO: "refresh_token" 테이블에 user_id, uuid, refresh_token 저장

    mysqlConnection.end();

    return uuid;
  },
  checkRefreshToken: async (uuid, secretKey) => {
    if (!uuid) {
      return false;
    }

    const mysqlConnection = await getMysqlConnection();

    // TODO: uuid로 refreshToken 테이블에서 uuid로 row 검색
    const [row, _fields] = await mysqlConnection.query(
      `select * from refresh_token where uuid='${uuid}'`
    );

    if (!row) {
      return false;
    }

    const refreshToken = row?.refreshToken;
    // refreshToken 유효성 검증
    jwt.verify(refreshToken, secretKey, (error, decoded) => {
      if (error) {
        console.log(error);
        return false;
      }
      return decoded;
    });

    mysqlConnection.end();
  },
};
