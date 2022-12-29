# vegan-auth-lambda
- AWS Lambda로 구현한 어쩌다보니 비건?! 서비스의 인증/인가 API 서버
- JWT를 사용하여 사용자를 인증함. accessToken과 refreshToken 발급

## Tech Stack
- Node.js
- Mysql
- Serverless Framework

## API List
- POST /auth/token (사용자 토큰 발급)
- POST /auth/logout (로그아웃)
- POST /auth/signup (관리자 로그인)
- POST /auth/refresh (토큰 재발급)
