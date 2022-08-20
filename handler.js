"use strict";

const { getSnsId } = require("./module/getSnsId");
const { getUsersByDB, getUserPaylod } = require("./module/userModel");
const { generateJwt } = require("./module/generateJwt");

module.exports.hello = async (event) => {
  let snsId = "";
  // 401 Error Block
  try {
    // 1. body로 토큰을 받는다.
    const body = event?.body && JSON.parse(event?.body);
    const provider = body?.provider;
    const token = body?.token;

    console.log("body value", provider, token);

    // 2. accessToken으로 provider의 회원 정보 API를 호출하여 회원을 식별할 수 있는 id 정보를 가져옴
    snsId = await getSnsId(provider, token);
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
    //const { isNew, ...payload } = getUserPaylod(snsId);
    const result = await getUsersByDB();
    console.log("user list 테스트", result);

    const { accessToken, refreshToken } = generateJwt(payload);
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log("isNew", isNew);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "로그인 성공", data: { isNew } }),
      multiValueHeaders: {
        "Set-Cookie": [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ],
      },
    };
  } catch (e) {
    console.log("Error 500:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "서버 내부 에러 발생" }),
    };
  }
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
