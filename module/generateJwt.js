const jwt = require("jsonwebtoken");

module.exports = {
  generateJwt: (payload = {}, secretKey) => {
    // jwt 토큰 생성 (accessToken, refreshToken)
    // payload: userId, nickname, profile

    const refreshToken = jwt.sign({}, secretKey, {
      expiresIn: "14d",
    });

    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: "2h",
    });

    return { accessToken, refreshToken };
  },
};
