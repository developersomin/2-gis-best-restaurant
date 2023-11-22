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
-   [TIL](#til)

<br>

## 개요

위치 기반 맛집 추천 및 맛집 조회 서비스 란?

-   본 서비스는 공공 데이터를 활용하여, 지역 음식점 목록을 자동으로 업데이트 하고 이를 활용한다.
-   사용자 위치에맞게 맛집 및 메뉴를 추천하여 더 나은 다양한 음식 경험을 제공하고, 음식을 좋아하는 사람들 간의 소통과 공유를 촉진하려 합니다.


<br>

## 기술 스택

언어 및 프레임워크: ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)</br>
데이터베이스: ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)</br>
개발환경: ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)</br>

<br>

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

<br>

## 프로젝트 분석

### 사용자
- 회원가입
  - 계정은 유저의 nickname 과 password 를 이용해 회원가입 실행 
  - password 는 숫자, 문자, 특수문자 중 2가지 이상을 포함
  - password 길이는 최소 10글자 이상 
  - 비밀번호 암호화 및 노출 금지 

- 로그인
  - 로그인 시 AccessToken , RefreshToken 발급 
  - 이후 Header에 AccessToken를 포함하여 JWT 유효성을 검증 
  - AccessToken 만료시 RefreshToken을 Header에 입력하여 AccessToken을 재발급 받는다.
  - Refresh 토큰 만료시 로그인을 다시한다. 

### 공공데이터 수집/전처리/자동화
- 수집
  - 경기도의 음식점 데이터를 수집하기 위해 axios를 활용하여 공공 데이터의 OPEN API를 호출
  - 한번의 호출로 얻을 수 있는 양이 1000개 이기 때문에 1000개씩 데이터를 불러와 전처리를 진행 후 저장
- 전처리
  - 종복 데이터를 방지하기 위해 상호명+주소를 결합하여 고유한 컬럼을 생성
  - 필수 정보가 null 인 경우 필터링하고 중요하지 않은 정보는 기본값 null로 설정
- 자동화
  - 스케줄러를 통한 음식점 업데이트 자동화 
  - 매주 월요일 00:00 에 자동 업데이트 실시 
  - 기존 음식점의 정보가 바뀌면 업데이트, 새로운 음식점이면 새로운 레코드 추가

### 시군구 조회 
- 시군구 조회 
  - 앱 실행시 csv 파일을 읽어 데이터베이스에 저장
  - 이후 시군구 조회 시 Redis 캐시 메모리에 없으면 실제 데이터베이스에서 조회 후 캐쉬에 저장
  - 다음 호출 시 Redis 캐시 메모리에서 데이터를 불러옴

### 맛집 조회
- 범위 내 맛집 조회
  - 하버사인 공식을 이용하여 거리를 계산 
  - 내 위치에서 반경에 맞는 사각형을 기준으로 최소 최대 위도 경도 값을 구하여 필터링
  - 커서 페이지네이션 적용
  
### 리뷰 점수 생성 
  - 사용자가 평가를 하면 점수가 평가 엔티티에 저장되고 평균을 계산하여 레스토랑에 저장한다.
  - 2번 이상 데이터베이스에 저장을 하기 때문에 트랜잭션을 사용하여 데이터 안정성과 무결성을 보장한다. 

### Discord WebHook을 활용한 점심 추천 서비스 

![스크린샷 2023-11-08 22-35-11](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/f101cf89-ef0c-468a-8525-26bf36846cda)


  - 유주 중 전심 추천 서비스 사용여부를 체크한 유저에 한해 주변 맛집 리스트를 제공한다. 
  - 500 미터 이내의 맛집을 랜덤으로 5개씩 제공한다.
  - 스케줄러를 통해 자동화 하여 11:30 때 추천

<br>

## DB 모델링
![image](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/847e1c76-007c-49fd-9dbf-c2d50a241cb5)


## API 명세서
### 공통 응답 형식
<details>
<summary> 공통 응답 형식 </summary>

- **SUCCESS** (요청 성공)

    ```json
    {
    	"success": true,
    	"statusCode": number,
    	"data": object | object[]
    }
    ```

- **FAIL** (요청 실패)

    ```json
    {
    	"statusCode": number,
    	"error": string,
    	"message": string,
    	"timestamp": string,
    	"path": string,
    }
    ```
  
</details>

<details>
<summary> 유저 API </summary>

- **POST /users(회원가입)**
    - **Body** Request

        ```json
        {
            "nickname": "ahngiwon12",
            "password": "ahngiwon12345"
        }
        ```

    - **201** Response

        ```json
        {
            "success": true,
            "statusCode": 201,
            "data": {
                "nickname": "ahngiwon12345",
                "deletedAt": null,
                "lon": null,
                "lat": null,
                "id": "0f9e3614-7df4-42f2-9b33-9e9df13e01fb",
                "createdAt": "2023-11-08T14:02:18.272Z",
                "updatedAt": "2023-11-08T14:02:18.272Z",
                "isRecommend": false
            }
        }
        ```

    - **400** Error

      nickname 중복시

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "이미 가입한 아이디가 있습니다.",
            "timestamp": "11/8/2023, 2:02:32 PM",
            "path": "/users"
        }
        ```

      비밀번호 제약조건 미준수

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": [
                "패스워드는 필수 입력 필드입니다.",
                "패스워드는 숫자, 문자, 특수문자 중 2가지 이상을 포함해야 합니다.",
                "패스워드는 10자리 이상이어야 합니다."
            ],
            "timestamp": "11/8/2023, 2:01:17 PM",
            "path": "/users"
        }
        ```

- **POST /users/login (로그인)**
    - **Body** Request

        ```jsx
        {
            "nickname": "ahngiwon12345",
            "password": "ahngiwon12345"
        }
        ```

    - **201** Response

        ```json
        {
            "success": true,
            "statusCode": 201,
            "data": {
                "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjllMzYxNC03ZGY0LTQyZjItOWIzMy05ZTlkZjEzZTAxZmIiLCJuaWNrbmFtZSI6ImFobmdpd29uMTIzNDUiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjk5NDUyMjQzLCJleHAiOjE2OTk0NTI4NDN9.Wf5hk5BgtAY_-F0PwiyOReN7m53apya0BS1hcELqy6o",
                "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjllMzYxNC03ZGY0LTQyZjItOWIzMy05ZTlkZjEzZTAxZmIiLCJuaWNrbmFtZSI6ImFobmdpd29uMTIzNDUiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTY5OTQ1MjI0MywiZXhwIjoxNjk5NDU5NDQzfQ.7RyMCyIiLnBARKNOvzlmsIgQjqJ5NEzbdGybcxEI8Xk"
            }
        }
        ```

    - **400** Error
      아이디가 존재하지 않을때, 비밀번호가 틀릴때

        ```json
        {
        		"statusCode": 400,
            "error": "Bad Request",
            "message": "아이디가 존재하지 않습니다.",
            "timestamp": "11/8/2023, 2:05:53 PM",
            "path": "/users/login"
        }
        ```

        ```json
        {
        		"statusCode": 401,
            "error": "Unauthorized",
            "message": "비밀번호가 틀렸습니다",
            "timestamp": "11/8/2023, 2:05:38 PM",
            "path": "/users/login"
        }
        ```

    - **400** Error
      토큰 만료

        ```json
        {
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "토큰 만료 또는 잘못된 토큰 입니다.",
            "timestamp": "11/8/2023, 2:36:43 PM",
            "path": "/users/0f9e3614-7df4-42f2-9b33-9e9df13e01f"
        }
        ```

- **POST /users/login (로그인)**
    - **Body** Request

        ```jsx
        {
            "nickname": "ahngiwon12345",
            "password": "ahngiwon12345"
        }
        ```

    - **201** Response

        ```json
        {
            "success": true,
            "statusCode": 201,
            "data": {
                "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjllMzYxNC03ZGY0LTQyZjItOWIzMy05ZTlkZjEzZTAxZmIiLCJuaWNrbmFtZSI6ImFobmdpd29uMTIzNDUiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjk5NDUyMjQzLCJleHAiOjE2OTk0NTI4NDN9.Wf5hk5BgtAY_-F0PwiyOReN7m53apya0BS1hcELqy6o",
                "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjllMzYxNC03ZGY0LTQyZjItOWIzMy05ZTlkZjEzZTAxZmIiLCJuaWNrbmFtZSI6ImFobmdpd29uMTIzNDUiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTY5OTQ1MjI0MywiZXhwIjoxNjk5NDU5NDQzfQ.7RyMCyIiLnBARKNOvzlmsIgQjqJ5NEzbdGybcxEI8Xk"
            }
        }
        ```

    - **400** Error
      아이디가 존재하지 않을때, 비밀번호가 틀릴때

        ```json
        {
        		"statusCode": 400,
            "error": "Bad Request",
            "message": "아이디가 존재하지 않습니다.",
            "timestamp": "11/8/2023, 2:05:53 PM",
            "path": "/users/login"
        }
        ```

        ```json
        {
        		"statusCode": 401,
            "error": "Unauthorized",
            "message": "비밀번호가 틀렸습니다",
            "timestamp": "11/8/2023, 2:05:38 PM",
            "path": "/users/login"
        }
        ```

    - **400** Error
      토큰 만료

        ```json
        {
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "토큰 만료 또는 잘못된 토큰 입니다.",
            "timestamp": "11/8/2023, 2:36:43 PM",
            "path": "/users/0f9e3614-7df4-42f2-9b33-9e9df13e01f"
        }
        ```

- **PATCH /users/:userId (회원 정보 수정)**
    - **Body** Request

        ```json
        {
            "isRecommend": true,
            "lon": 127.262509,
            "lat": 36.50843
        }
        ```

    - **200** Response

        ```json
        {
            "success": true,
            "statusCode": 200,
            "data": "업데이트 성공 "
        }
        ```

    - **400** Error

      점심 추천 기능 비워있을 때

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": [
                "점심 추천 기능 필수 입력 필드입니다.",
                "isRecommend must be a boolean value"
            ],
            "timestamp": "11/8/2023, 2:12:41 PM",
            "path": "/users/0f9e3614-7df4-42f2-9b33-9e9df13e01fb"
        }
        ```

      위도 값을 입력 안했을 때

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": [
                "위도값은 필수 입력 필드입니다.",
                "유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다.",
                "유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다."
            ],
            "timestamp": "11/8/2023, 2:15:22 PM",
            "path": "/users/0f9e3614-7df4-42f2-9b33-9e9df13e01fb"
        }
        ```

      경도 값을 입력 안했을 때

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": [
                "경도값은 필수 입력 필드입니다.",
                "유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다.",
                "유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다."
            ],
            "timestamp": "11/8/2023, 2:15:48 PM",
            "path": "/users/0f9e3614-7df4-42f2-9b33-9e9df13e01fb"
        }
        ```

- **GET /users/:userId (회원 상세 정보)**
    - **200** Response

        ```json
        {
            "success": true,
            "statusCode": 200,
            "data": {
                "id": "0f9e3614-7df4-42f2-9b33-9e9df13e01fb",
                "createdAt": "2023-11-08T14:02:18.272Z",
                "updatedAt": "2023-11-08T14:15:15.000Z",
                "deletedAt": null,
                "nickname": "ahngiwon12345",
                "lon": "127.2625090000",
                "lat": "36.5084300000",
                "isRecommend": true,
                "evaluations": []
            }
        }
        ```

    - **400** Error

</details>

<details>
<summary> 인증인가 API </summary>

- **POST /auth/token/access (access토큰 재발급)**

  헤더에 authorization : Bearer {refreshToken} 입력

    - **201** Response

        ```json
        {
            "success": true,
            "statusCode": 201,
            "data": {
                "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6ImFobmdpd29uMTIzNDUiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjk5NDU1MjcwLCJleHAiOjE2OTk0NTU4NzB9.trYRV4RhcOJ4jkr6bIbz1KmqZywdYmDwA_OElJF8DYY"
            }
        }
        ```

    - **400** Error

      잘못된 토큰 일 시

        ```json
        {
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "잘못된 토큰 입니다.",
            "timestamp": "11/8/2023, 2:43:38 PM",
            "path": "/auth/token/access"
        }
        ```
        ```
        
        refresh 토큰이 아닐시 
        
        ```json
        {
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "Refresh Token 이 아닙니다.",
            "timestamp": "11/8/2023, 2:40:22 PM",
            "path": "/auth/token/access"
        }
        ```

      토큰 재발급은 항상 refresh 토큰으로만 허용

        ```json
        {
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "토큰 재발급은 Refresh 토큰으로만 가능합니다!",
            "timestamp": "11/8/2023, 2:41:39 PM",
            "path": "/auth/token/access"
        }
        ```

- **POST /auth/token/refresh (refresh토큰 재발급)**

  헤더에 authorization : Bearer {refreshToken} 입력

    - **201** Response

        ```json
        {
            "success": true,
            "statusCode": 201,
            "data": {
                "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6ImFobmdpd29uMTIzNDUiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTY5OTQ1NTM3OSwiZXhwIjoxNjk5NDYyNTc5fQ.qnRnP_nhnWGPa7ZTDzw_7yjDygCRRj8fQWd1Yqrdebk"
            }
        }
        ```

    - **401** Error

      잘못된 토큰 일 시

        ```json
        {
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "토큰 만료 또는 잘못된 토큰 입니다.",
            "timestamp": "11/8/2023, 2:56:43 PM",
            "path": "/auth/token/refresh"
        }
        ```

      refresh Token이 아닐시

        ```json
        {
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "Refresh Token이 아닙니다.",
            "timestamp": "11/8/2023, 2:57:09 PM",
            "path": "/auth/token/refresh"
        }
        ```


</details>

<details>

<summary> 시군구 목록 조회 API </summary>

- **GET /area (지역 목록)**
    - **200** Response

        ```json
        [
            {
                "dosi": "강원",
                "sgg": "고성군",
                "lon": "128.4701639",
                "lat": "38.37796111"
            },
            {
                "dosi": "강원",
                "sgg": "동해시",
                "lon": "129.1166333",
                "lat": "37.52193056"
            },
            {
                "dosi": "강원",
                "sgg": "삼척시",
                "lon": "129.1674889",
                "lat": "37.44708611"
            },
            {
                "dosi": "강원",
                "sgg": "속초시",
                "lon": "128.5941667",
                "lat": "38.20427500"
            },
            {
                "dosi": "강원",
                "sgg": "양구군",
                "lon": "127.9922444",
                "lat": "38.10729167"
            },
            ...more
        ```
      
      </details>
<details>

<summary> 맛집 평가 API </summary>

### 맛집 평가 API

- **POST /evaluations (평가)**
    - Query Param

        ```json
        {
            "score" : 3,
            "content" : "dsa",
            "resName" : "민속촌",
            "lotNoAddr" : "경기도 광주시 송정동 239번지"
        }
        ```

    - **200** Response

        ```json
        {
            "success": true,
            "statusCode": 201,
            "data": {
                "score": 3,
                "content": "dsa",
                "user": {
                    "id": "0f9e3614-7df4-42f2-9b33-9e9df13e01fb"
                },
                "restaurant": {
                    "resName": "민속촌",
                    "lotNoAddr": "경기도 광주시 송정동 239번지"
                },
                "deletedAt": null,
                "id": "aedae850-1960-4ca9-8f45-bb6d80794aa1",
                "createdAt": "2023-11-08T15:02:15.682Z",
                "updatedAt": "2023-11-08T15:02:15.682Z"
            }
        }
        ```

    - **400** Error

      잘못된 범위의 점수를 입력 했을 때

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": [
                "0~5 숫자를 입력하세요"
            ],
            "timestamp": "11/8/2023, 3:03:01 PM",
            "path": "/evaluations"
        }
        ```

      음식점을 제대로 입력하지 않았을 때

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "음식점이 존재하지 않습니다.",
            "timestamp": "11/8/2023, 3:02:47 PM",
            "path": "/evaluations"
        }
        ```

    - **401** Error

      토큰이 만료 되었을 때

        ```json
        {
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "토큰 만료 또는 잘못된 토큰 입니다.",
            "timestamp": "11/8/2023, 2:59:53 PM",
            "path": "/evaluations"
        }
        ```


</details>

<details>
<summary> 맛집 조회 API </summary>

- **POST /restaurants** (맛집 조회)
    - Query Param

        ```json
        {
            "lat" : 37.3903509131,
            "lon" : 126.9530697992,
            "range" : 1,
            "order__distance" : "ASC"
        }
        ```

    - **200** Response

        ```json
        {
            "success": true,
            "statusCode": 200,
            "data": {
                "data": [
                    {
                        "restaurants_resNo": 17224,
                        "restaurants_resName": "홍콩반점0410범계역점",
                        "restaurants_detailAddr": "아트타워빌딩 207호",
                        "restaurants_storeTypeName": "일반음식점",
                        "restaurants_foodTypeName": "기타 음식점업",
                        "restaurants_telNo": "031-382-7410",
                        "restaurants_slctnYnDiv": "Y",
                        "restaurants_roadAddr": "경기도 안양시 동안구 평촌대로223번길 49",
                        "restaurants_lotNoAddr": "경기도 안양시 동안구 호계동 1046-6번지",
                        "restaurants_zipNo": 14072,
                        "restaurants_lon": "126.9530697992",
                        "restaurants_lat": "37.3903509134",
                        "restaurants_scoreAvg": "0.0",
                        "restaurants_areaDosi": "경기도",
                        "restaurants_areaSgg": "안양시",
                        "distance": 0
                    },
                    {
                        "restaurants_resNo": 17225,
                        "restaurants_resName": "화덕피자앤직화구이",
                        "restaurants_detailAddr": "아트타워빌딩 206호",
                        "restaurants_storeTypeName": "일반음식점",
                        "restaurants_foodTypeName": "한식",
                        "restaurants_telNo": "031-381-3392",
                        "restaurants_slctnYnDiv": "Y",
                        "restaurants_roadAddr": "경기도 안양시 동안구 평촌대로223번길 49",
                        "restaurants_lotNoAddr": "경기도 안양시 동안구 호계동 1046-6번지",
                        "restaurants_zipNo": 14072,
                        "restaurants_lon": "126.9530697992",
                        "restaurants_lat": "37.3903509134",
                        "restaurants_scoreAvg": "0.0",
                        "restaurants_areaDosi": "경기도",
                        "restaurants_areaSgg": "안양시",
                        "distance": 0
                    },
                    {
                        "restaurants_resNo": 17162,
                        "restaurants_resName": "유미카츠범계점",
                        "restaurants_detailAddr": null,
                        "restaurants_storeTypeName": "일반음식점",
                        "restaurants_foodTypeName": "기타 음식점업",
                        "restaurants_telNo": "031-386-8808",
                        "restaurants_slctnYnDiv": "Y",
                        "restaurants_roadAddr": "경기도 안양시 동안구 평촌대로223번길 48",
                        "restaurants_lotNoAddr": "경기도 안양시 동안구 호계동 1045-7번지",
                        "restaurants_zipNo": 14072,
                        "restaurants_lon": "126.9529424596",
                        "restaurants_lat": "37.3907739694",
                        "restaurants_scoreAvg": "0.0",
                        "restaurants_areaDosi": "경기도",
                        "restaurants_areaSgg": "안양시",
                        "distance": 0.04836811352423912
                    },
                    {
                        "restaurants_resNo": 17204,
                        "restaurants_resName": "탕화쿵푸마라탕",
                        "restaurants_detailAddr": "서련코아 201호(호계동)",
                        "restaurants_storeTypeName": "일반음식점",
                        "restaurants_foodTypeName": "한식",
                        "restaurants_telNo": "031-383-0420",
                        "restaurants_slctnYnDiv": "Y",
                        "restaurants_roadAddr": "경기도 안양시 동안구 평촌대로223번길 59",
                        "restaurants_lotNoAddr": "경기도 안양시 동안구 호계동 1046-3번지",
                        "restaurants_zipNo": 14072,
                        "restaurants_lon": "126.9525289450",
                        "restaurants_lat": "37.3901591223",
                        "restaurants_scoreAvg": "0.0",
                        "restaurants_areaDosi": "경기도",
                        "restaurants_areaSgg": "안양시",
                        "distance": 0.05232554253139039
                    },
                    ... more
                ],
                "cursor": {
                    "after": 4722
                },
                "count": 20,
                "next": "http://localhost:3000/restaurants?take=20&lat=37.3903509131&lon=126.9530697992&range=1&order__distance=ASC&cursor=4722"
            }
        }
        ```

    - **400** Error

      반경 RANGE 을 입력 안했을 때

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": [
                "반경 값은 필수 입니다.(KM)"
            ],
            "timestamp": "11/8/2023, 3:13:53 PM",
            "path": "/restaurants?lat=37.3903509131&lon=126.9530697992&order__distance=ASC"
        }
        ```

      경도 값을 입력 안했을때

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": [
                "경도값은 필수 입력 필드입니다.",
                "유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다.",
                "유효한 경도 값이 아닙니다. -180에서 180 사이의 값이어야 합니다."
            ],
            "timestamp": "11/8/2023, 3:14:29 PM",
            "path": "/restaurants?lat=37.3903509131&range=1&order__distance=ASC"
        }
        ```

      위도 값을 입력 안했을때

        ```json
        {
            "statusCode": 400,
            "error": "Bad Request",
            "message": [
                "위도값은 필수 입력 필드입니다.",
                "유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다.",
                "유효한 위도 값이 아닙니다. -90에서 90 사이의 값이어야 합니다."
            ],
            "timestamp": "11/8/2023, 3:14:39 PM",
            "path": "/restaurants?lon=&range=1&order__distance=ASC"
        }
        ```

    - **401** Error

      토큰이 만료 되었을 때

        ```json
        {
            "statusCode": 401,
            "error": "Unauthorized",
            "message": "토큰 만료 또는 잘못된 토큰 입니다.",
            "timestamp": "11/8/2023, 2:59:53 PM",
            "path": "/evaluations"
        }
        ```

</details>

<br>

## 프로젝트 진행 
![image](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/8b83cd26-f54d-436b-8ccb-b5a431e82515)
![image](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/b74c02e0-a50c-4c22-9d3f-bd0bce299be7)

<br>


## TIL
![image](https://github.com/developersomin/2-gis-best-restaurant/assets/127207131/c0c57b16-5359-4d18-8d46-f77b18c813bf)
-   [커서 페이지네이션 - TIL 🔗](https://quixotic-trust-a91.notion.site/cc7ae2f7ac1d484c81ff06cba95cc876?pvs=4)
-   [스케줄 - TIL 🔗](https://quixotic-trust-a91.notion.site/0adb299a733b4f4186ea1c290110b30d?pvs=4)
-   [Redis - TIL 🔗](https://quixotic-trust-a91.notion.site/Redis-8c1e9292148b469a9118f32b62ea5060?pvs=4)
-   [JWT - TIL 🔗](https://quixotic-trust-a91.notion.site/JWT-72b1adbf025d42b88d5784ba838ebaad?pvs=4)
