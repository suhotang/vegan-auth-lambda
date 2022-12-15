const jwt = require("jsonwebtoken");
const { saveRefreshToken } = require("../model/authModel");

module.exports = {
  generateNewTokens: async (payload = {}, secretKey) => {
    // jwt 토큰 생성 (accessToken, refreshToken)
    // payload: userId, nickname, profile

    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: "2h",
    });

    const refreshToken = jwt.sign(payload, secretKey, {
      expiresIn: "14d",
    });
    const refreshTokenUUID = await saveRefreshToken(
      payload?.userId,
      refreshToken
    );

    return { accessToken, refreshTokenUUID };
  },
  generateNewAccessToken: (payload = {}, secretKey) => {
    return jwt.sign(payload, secretKey, {
      expiresIn: "2h",
    });
  },
};
