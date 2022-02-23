import { JSONSchema6 } from 'json-schema';

const JSCRegisterUserReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    body: {
      additionalProperties: false,
      properties: {
        displayName: {
          description: '사용자가 마음껏 변경해서 뿌릴 수 있는 이름',
          type: 'string',
        },
        email: {
          type: 'string',
        },
        photoURL: {
          type: 'string',
        },
        provider: {
          description: 'twitter, google 등 social media provider 구분',
          type: 'string',
        },
        screenName: {
          description: '사용자 id 외에 별도로 사용자를 지칭할 수 있는 이름',
          type: 'string',
        },
        twitterAuth: {
          additionalProperties: false,
          properties: {
            accessToken: {
              type: 'string',
            },
            secret: {
              type: 'string',
            },
            uid: {
              type: 'string',
            },
          },
          required: ['accessToken', 'secret', 'uid'],
          type: 'object',
        },
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
      },
      required: ['provider', 'screenName', 'uid'],
      type: 'object',
    },
  },
  required: ['body'],
  type: 'object',
};

export default JSCRegisterUserReq;
