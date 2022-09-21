const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

async function getUserinfoByProvider(url, token) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(url, { headers });
    return response?.data;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getSnsId: async (provider, token) => {
    // accessToken으로 provider의 회원 정보 API를 호출하여 사용자 정보를 가져옴
    // 사용자 정보에서 회원번호를 가져옴
    try {
      let snsId = "";
      switch (provider) {
        case "kakao":
          const kakaoUserData = await getUserinfoByProvider(
            "https://kapi.kakao.com/v2/user/me",
            token
          );
          console.log("kakao", kakaoUserData);
          snsId = kakaoUserData?.id;
          break;
        case "naver":
          const naverUserData = await getUserinfoByProvider(
            "https://openapi.naver.com/v1/nid/me",
            token
          );
          snsId = naverUserData?.response?.id;
          break;
        case "google":
          // google의 경우 jwt 형식의 id_token을 받아올 수 있기 때문에
          // google에 검증 요청을 하지 않아도 token의 유효성을 직접 검증할 수 있다.

          const ticket = await client.verifyIdToken({
            idToken: token,
          });
          const payload = ticket.getPayload();
          snsId = payload["sub"]; // 21자리의 Google 회원 id 번호
          break;
        default:
          // 실패했으면 사용자에게 로그인 실패했다는 응답을 보낸다.
          throw "Login Failed";
      }
      return snsId;
    } catch (e) {
      console.log("사용자 검증 실패!");
      console.log(e);
      throw "사용자 검증 실패!";
    }
  },
};
