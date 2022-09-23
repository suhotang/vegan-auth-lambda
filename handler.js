"use strict";

const { getSnsId } = require("./module/getSnsId");
const { getUserPaylod } = require("./module/userModel");
const { generateJwt } = require("./module/generateJwt");
const api = require("lambda-api")();

api.post("/auth/token", async (req, res) => {
  console.log("POST /auth/token");
  let snsId = "";
  // 401 Error Block
  try {
    // 1. body로 토큰을 받는다.
    const body = req?.body
    const provider = body?.provider;
    const token = body?.token;

    console.log("body value", provider, token);

    // 2. accessToken으로 provider의 회원 정보 API를 호출하여 회원을 식별할 수 있는 id 정보를 가져옴
    snsId = await getSnsId(provider, token);
    console.log("사용자 식별번호", snsId);
  } catch (e) {
    console.log("Error 401:", e);
    return res.status(401).json({
      message: "사용자 검증 실패"
    });
  }

  // 500 Error Block
  try {
    // 3. snsId로 user 테이블에서 유저가 이미 존재하는지 확인
    const { isNew, ...payload } = await getUserPaylod(snsId);
    const { accessToken, refreshToken } = generateJwt(payload);

    res.cookie("accessToken", accessToken, { maxAge: 3600 * 1000, httpOnly: true }).send();
    res.cookie("refreshToken", refreshToken, { maxAge: 3600 * 1000, httpOnly: true }).send();

    return res.status(200).json({
      message: "로그인 성공", data: { isNew }
    });
  } catch (e) {
    console.log("Error 500:", e);
    return res.status(500).json({
      message: "서버 내부 에러 발생"
    });
  }
});

api.post("/auth/logout", async (req, res) => {
  try {
    console.log("POST /auth/logout");
    res.clearCookie("accessToken").send();
    res.clearCookie("refreshToken").send();

    return res.status(200).json({
      message: "로그아웃 성공"
    });
  } catch (e) {
    console.log("Error 500:", e);
    return res.status(500).json({
      message: "서버 내부 에러 발생"
    });
  }
})

module.exports.router = async (event, context) => {
  return await api.run(event, context);
};
