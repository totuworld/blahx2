# blahx2
익명 질문 서비스

## 주요 기능
* 이벤트를 생성한 뒤 익명으로 질문을 등록합니다.
* 이벤트 생성한 사용자는 이벤트를 마감할 수 있습니다.
* 사용자는 등록된 질문에 좋아요를 클릭할 수 있습니다.
  * 한번 좋아요 클릭한 뒤 2번 좋아요할 수 없습니다.
* 익명 질문은 최대 300자까지만 지원합니다.

## 개발환경 준비

### .env 생성하기
아래 필드가 모두 필요하다.
```
publicApiKey=firebase - web client용
FIREBASE_AUTH_HOST=firebase - web client용
privateKey=firebase - admin용
clientEmail=firebase - admin용
projectId=firebase
```