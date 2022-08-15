const mysql = require("mysql");

module.exports = {
  getUserPaylod: (snsId) => {
    // 회원번호로 user table을 조회해서 해당하는 row가 있는지 확인
    // 해당하는 row가 있으면 사용자 정보를 가져온다.
    // // mysql find

    // // 4. 유저가 존재하지 않는다면, 새로운 유저 생성
    // if (!isExist) {
    //   createNewUser(snsId);
    // }
    return { userId: snsId, nickname: "test", profile: null, isNew: true };
  },
};
