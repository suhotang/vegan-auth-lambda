"use strict";

const { getSnsId } = require("./module/getSnsId");
const { getUserPaylod } = require("./module/userModel");
const { generateJwt } = require("./module/generateJwt");
const api = require("lambda-api")();

api.post("/auth/token", async (req, res) => {
  let snsId = "";
  // 401 Error Block
  try {
    // 1. body로 토큰을 받는다.
    const body = req?.body && JSON.parse(req?.body);
    const provider = body?.provider;
    const token = body?.token;

    console.log("body value", provider, token);

    // 2. accessToken으로 provider의 회원 정보 API를 호출하여 회원을 식별할 수 있는 id 정보를 가져옴
    snsId = await getSnsId(provider, token);
    console.log("사용자 식별번호", snsId);
  } catch (e) {
    console.log("Error 401:", e);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "사용자 검증 실패" }),
    };
  }

  // 500 Error Block
  try {
    // 3. snsId로 user 테이블에서 유저가 이미 존재하는지 확인
    const { isNew, ...payload } = await getUserPaylod(snsId);
    const { accessToken, refreshToken } = generateJwt(payload);

    console.log("accessToken");
    res.cookie("accessToken", accessToken, { maxAge: 3600 * 1000, httpOnly: true }).send();

    console.log("refreshToken");
    res.cookie("refreshToken", refreshToken, { maxAge: 3600 * 1000, httpOnly: true }).send();

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ message: "로그인 성공", data: { isNew } }),
    //   multiValueHeaders: {
    //     "Set-Cookie": [
    //       `accessToken=${accessToken}`,
    //       `refreshToken=${refreshToken}`,
    //     ],
    //   },
    // };
    res.status(200).json({
      message: "로그인 성공", data: { isNew }
    });
  } catch (e) {
    console.log("Error 500:", e);
    res.status(500).json({
      message: "서버 내부 에러 발생"
    });
  }
})

module.exports.router = async (event, context) => {
  return await api.run(event, context);
};
