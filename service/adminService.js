const CryptoJS = require("crypto-js");
const { getAdminUserById } = require("../model/userModel");
const { generateNewTokens } = require("../util/generateJwt");

// 사용자와 관리자의 cookie option이 달라야할까?
const cookieOption = {
  maxAge: 3600 * 1000,
  httpOnly: true,
};

module.exports = {
  login: async (req, res) => {
    console.log("POST /auth/login (관리자용 로그인)");
    try {
      const body = req?.body;
      const id = body?.id;
      const password = body?.password;

      // DB에서 id로 Row 조회
      // id가 db에 없으면 400 error (로그인 실패)
      const userRow = await getAdminUserById(id);

      // row의 password와 받은 password 비교
      // password가 일치하지 않으면 400 error (로그인 실패)
      if (userRow) {
        let cryptoInputPassword = CryptoJS.PBKDF2(password, userRow?.salt, {
          keySize: 256 / 32,
          iterations: 1000,
        });
        cryptoInputPassword = CryptoJS.enc.Hex.stringify(cryptoInputPassword);

        if (userRow?.password !== cryptoInputPassword) {
          throw {
            statusCode: 400,
          };
        }
      }

      // accessToken과 refreshToken을 생성, 응답의 cookie 헤더에 세팅해준다.
      const jwtPayload = { userId: userRow?.userId, authority: [] };
      const { accessToken, refreshTokenUUID } = await generateNewTokens(
        jwtPayload,
        process.env.ADMIN_JWT_SECRET_KEY
      );

      res.cookie("accessToken", accessToken, cookieOption).send();
      res.cookie("refreshToken", refreshTokenUUID, cookieOption).send();

      return res.status(200).json({
        message: "로그인 성공",
      });
    } catch (e) {
      if (typeof e === "object" && e?.statusCode === 400) {
        res.error(400, "아이디 or 비밀번호가 올바르지 않습니다.");
      }
      res.error("서버 내부 에러");
    }
  },
};
