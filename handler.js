"use strict";

const { getSnsId } = require("./module/getSnsId");
const { getUserPaylod } = require("./module/userModel");
const { generateJwt } = require("./module/generateJwt");
const api = require("lambda-api")();

// SNS 로그인 시 토큰 발급
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
    // console.log("사용자 식별번호", snsId);
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

// 일반 로그인 (관리자용)
api.post("/auth/login", async (req, res) => {
  console.log("POST /auth/login");
  try {
    // 1. body로 토큰을 받는다.
    const body = req?.body
    const id = body?.id;
    const password = body?.password;

    console.log("body value", id, password);

    // db에서 id로 row 조회
    // id가 db에 없으면 500 return (로그인 실패)
    
    // row의 password와 받은 password 비교 (암호화)
    // password가 일치하지 않으면 500 return

    // password가 일치하면 쿠키에 토큰 설정
    // 토큰 설정이 완료되면

    // return res.status(200).json({
    //   message: "로그인 성공", data: { isNew }
    // });
  } catch (e) {
    console.log("Error 500:", e);
    return res.status(500).json({
      message: "서버 내부 에러 발생"
    });
  }
});

// 로그아웃
api.post("/auth/logout", async (req, res) => {
  console.log("POST /auth/logout");
  try {
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
});

// 회원 탈퇴
api.delete("/auth/secession", async (req, res) => {
  console.log("POST /auth/secession");
  try {
    // return res.status(200).json({
    //   message: "로그아웃 성공"
    // });
  } catch (e) {
    console.log("Error 500:", e);
    return res.status(500).json({
      message: "서버 내부 에러 발생"
    });
  }
});

module.exports.router = async (event, context) => {
  return await api.run(event, context);
};
