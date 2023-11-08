# 지리기반 맛집 추천 웹 서비스 
![image](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/013c1556-c7e4-4824-91a5-d1cab93fad2d)
 

## 목차

-   [개요](#개요)
-   [기술 스택](#기술-스택)
-   [실행 스크립트](#실행-스크립트)
-   [프로젝트 분석](#프로젝트-분석)
-   [DB 모델링](#DB-모델링)
-   [API 명세서](#api-명세서)
-   [프로젝트 진행 및 이슈](#프로젝트-진행-및-이슈-)
-   [테스트 구현 (예정)](#테스트-구현-예정)
-   [TIL](#til)

## 개요

위치 기반 맛집 추천 및 맛집 조회 서비스 란?

-   본 서비스는 공공 데이터를 활용하여, 지역 음식점 목록을 자동으로 업데이트 하고 이를 활용한다.
-   사용자 위치에맞게 맛집 및 메뉴를 추천하여 더 나은 다양한 음식 경험을 제공하고, 음식을 좋아하는 사람들 간의 소통과 공유를 촉진하려 합니다.


## 기술 스택

언어 및 프레임워크: ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)</br>
데이터베이스: ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)</br>
개발환경: ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)</br>

## 실행 스크립트

```bash
# docker 빌드
docker-compse build

# docker 실행
docker-compose up 
```
<details>
<summary> 환경 변수 보기 </summary>

```
# 데이터베이스 연결
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_DATABASE=

# Redis
REDIS_PORT=

# 오픈API 인증키
OPEN_API_KEY=
OPEN_API_TYPE=

#비밀번호 암호화
HASH_SALT=

#JWT
JWT_SECRET=

#discord webhook
DISCORD_WEB_HOOK=
```
</details>

## 프로젝트 분석

TODO: 작성 필요

## DB 모델링
![image](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/847e1c76-007c-49fd-9dbf-c2d50a241cb5)


## API 명세서
[API 설계 🔗 ](https://www.notion.so/2-gis-best-restaurant-3a47b2706aad415d9e560e8a5ede061f?p=8ed3697f50e14fd1a777cfa7ce20cf37&pm=s) 

## 프로젝트 진행 및 이슈 
![image](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/8b83cd26-f54d-436b-8ccb-b5a431e82515)
![image](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/b74c02e0-a50c-4c22-9d3f-bd0bce299be7)
## 테스트 구현 (예정)

TODO: 작성 필요


## TIL
![image](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/c0c57b16-5359-4d18-8d46-f77b18c813bf)
-   [커서 페이지네이션 - TIL 🔗](https://www.notion.so/cc7ae2f7ac1d484c81ff06cba95cc876)
-   [스케줄 - TIL 🔗](https://www.notion.so/0adb299a733b4f4186ea1c290110b30d)
-   [Redis - TIL 🔗](https://www.notion.so/Redis-8c1e9292148b469a9118f32b62ea5060)
-   [JWT - TIL 🔗](https://www.notion.so/JWT-72b1adbf025d42b88d5784ba838ebaad)
