const jwt = require("jsonwebtoken");

module.exports = {
  generateJwt: (payload = {}) => {
    // jwt 토큰 생성 (accessToken, refreshToken)
    // payload: userId, nickname, profile

    const refreshToken = jwt.sign({}, process.env.JWT_SECRET_KEY, {
      expiresIn: "14d",
    });

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "2h",
    });

    return { accessToken, refreshToken };
  },
};
