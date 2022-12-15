"use strict";

const { getUserToken, logout, tokenRefresh } = require("./service/userService");
const { login: adminLogin } = require("./service/adminService");
const api = require("lambda-api")();

// SNS 로그인 시 토큰 발급
api.post("/auth/token", getUserToken);
// 일반 로그인 (관리자용)
api.post("/auth/login", adminLogin);
// 로그아웃
api.post("/auth/logout", logout);
// accessToken 갱신
api.post("/auth/refresh", tokenRefresh);

module.exports.router = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return await api.run(event, context);
};
