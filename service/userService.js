const { getSnsIdFromProvider } = require("../util/getSnsIdFromProvider");
const { getUserPaylod, createNewUser } = require("../model/userModel");
const {
  generateNewTokens,
  generateNewAccessToken,
} = require("../util/generateJwt");
const { checkRefreshToken } = require("../model/authModel");

// 사용자와 관리자의 cookie option이 달라야할까?
const cookieOption = {
  maxAge: 3600 * 1000,
  httpOnly: true,
};

module.exports = {
  getUserToken: async (req, res) => {
    console.log("POST /auth/token");
    let snsId = "";
    try {
      // 1. body로 토큰을 받는다.
      const body = req?.body;
      const provider = body?.provider;
      const token = body?.token;

      // 2. accessToken으로 provider의 회원 정보 API를 호출하여 회원을 식별할 수 있는 id 정보를 가져옴
      snsId = await getSnsIdFromProvider(provider, token);
    } catch (e) {
      return res.error(401, "사용자 검증 실패");
    }

    try {
      // 3. snsId로 user 테이블에서 유저가 이미 존재하는지 확인
      let isNew = false;
      let userId = await getUserPaylod(snsId);
      if (!userId) {
        // 신규 사용자 등록
        userId = await createNewUser();
        isNew = true;
      }

      const { accessToken, refreshTokenUUID } = await generateNewTokens(
        { userId },
        process.env.JWT_SECRET_KEY
      );

      res.cookie("accessToken", accessToken, cookieOption).send();
      res.cookie("refreshToken", refreshTokenUUID, cookieOption).send();

      return res.status(200).json({
        message: "로그인 성공",
        data: { isNew },
      });
    } catch (e) {
      res.error("서버 내부 에러");
    }
  },
  logout: async (_req, res) => {
    console.log("POST /auth/logout");
    try {
      res.clearCookie("accessToken").send();
      res.clearCookie("refreshToken").send();

      return res.status(200).json({
        message: "로그아웃 성공",
      });
    } catch (e) {
      res.error("서버 내부 에러");
    }
  },
  tokenRefresh: async (req, res) => {
    console.log("POST /auth/refresh");
    try {
      const refreshTokenUUID = req?.cookies?.refreshToken;
      const isAdmin = req?.query?.isAdmin;
      const jwtSecretKey = isAdmin
        ? process.env.ADMIN_JWT_SECRET_KEY
        : process.env.JWT_SECRET_KEY;

      const result = await checkRefreshToken(refreshTokenUUID, jwtSecretKey);
      if (!result) {
        throw {
          statusCode: 401,
        };
      }

      const newAccessToken = generateNewAccessToken(
        { ...result },
        jwtSecretKey
      );
      // 새로운 accessToken을 세팅해준다.
      res.cookie("accessToken", newAccessToken, cookieOption).send();

      return res.status(200).json({
        message: "토큰 갱신 성공",
      });
    } catch (e) {
      if (typeof e === "object" && e?.statusCode === 401) {
        res.error(401, "권한이 없는 사용자");
      }
      res.error("서버 내부 에러");
    }
  },
};
