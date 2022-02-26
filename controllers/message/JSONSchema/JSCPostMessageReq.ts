import { JSONSchema6 } from 'json-schema';

const JSCPostMessageReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    body: {
      additionalProperties: false,
      properties: {
        message: {
          type: 'string',
        },
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
        author: {
          additionalProperties: false,
          properties: {
            displayName: {
              description: '사용자가 마음껏 변경해서 뿌릴 수 있는 이름',
              type: 'string',
            },
            photoURL: {
              type: 'string',
            },
          },
          required: ['displayName'],
        },
      },
      required: ['uid', 'message'],
      type: 'object',
    },
  },
  required: ['body'],
  type: 'object',
};

export default JSCPostMessageReq;
